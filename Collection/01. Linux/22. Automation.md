# Linux Automation: Ansible, Puppet, and CI/CD Tools

## Overview

Automation in Linux involves using configuration management tools, infrastructure as code, and continuous integration/deployment pipelines to manage systems efficiently and consistently. This guide covers major automation platforms and best practices.

## Ansible

### Ansible Basics
```bash
# Install Ansible
sudo apt install ansible          # Ubuntu/Debian
sudo yum install ansible          # CentOS/RHEL
pip3 install ansible             # Python pip

# Verify installation
ansible --version
ansible-config dump              # Show configuration

# Basic Ansible structure
/etc/ansible/
├── ansible.cfg                  # Configuration file
├── hosts                        # Inventory file
└── group_vars/                  # Group variables
    └── all.yml
```

### Inventory Management
```bash
# Static inventory (/etc/ansible/hosts)
[webservers]
web1.example.com ansible_host=192.168.1.10 ansible_user=ubuntu
web2.example.com ansible_host=192.168.1.11 ansible_user=ubuntu

[databases]
db1.example.com ansible_host=192.168.1.20
db2.example.com ansible_host=192.168.1.21

[production:children]
webservers
databases

[all:vars]
ansible_ssh_private_key_file=~/.ssh/ansible_key

# Dynamic inventory (AWS example)
ansible-inventory -i aws_ec2.yml --graph

# Test connectivity
ansible all -m ping
ansible webservers -m ping -i inventory.ini
```

### Ansible Ad-hoc Commands
```bash
# Basic commands
ansible all -m command -a "uptime"
ansible webservers -m shell -a "df -h"
ansible all -m setup                    # Gather facts

# Package management
ansible all -m apt -a "name=nginx state=present" --become
ansible all -m yum -a "name=httpd state=latest" --become

# Service management
ansible webservers -m systemd -a "name=nginx state=started enabled=yes" --become

# File operations
ansible all -m copy -a "src=/local/file dest=/remote/file mode=644" --become
ansible all -m file -a "path=/tmp/testdir state=directory mode=755"

# User management
ansible all -m user -a "name=deploy shell=/bin/bash" --become
ansible all -m authorized_key -a "user=deploy key='{{ lookup('file', '~/.ssh/id_rsa.pub') }}'"
```

### Ansible Playbooks
```yaml
# Basic playbook (webserver.yml)
---
- name: Configure web servers
  hosts: webservers
  become: yes
  vars:
    nginx_port: 80
    domain_name: example.com
  
  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: present
        update_cache: yes
    
    - name: Start and enable nginx
      systemd:
        name: nginx
        state: started
        enabled: yes
    
    - name: Copy nginx configuration
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/sites-available/{{ domain_name }}
        backup: yes
      notify: restart nginx
    
    - name: Enable site
      file:
        src: /etc/nginx/sites-available/{{ domain_name }}
        dest: /etc/nginx/sites-enabled/{{ domain_name }}
        state: link
      notify: restart nginx
    
    - name: Remove default site
      file:
        path: /etc/nginx/sites-enabled/default
        state: absent
      notify: restart nginx
  
  handlers:
    - name: restart nginx
      systemd:
        name: nginx
        state: restarted

# Run playbook
ansible-playbook webserver.yml
ansible-playbook webserver.yml --limit webservers
ansible-playbook webserver.yml --check --diff    # Dry run
```

### Advanced Ansible Features
```yaml
# Roles structure
roles/
├── common/
│   ├── tasks/main.yml
│   ├── handlers/main.yml
│   ├── templates/
│   ├── files/
│   ├── vars/main.yml
│   └── defaults/main.yml
├── webserver/
└── database/

# Using roles in playbook
---
- hosts: all
  roles:
    - common
    - { role: webserver, nginx_port: 8080 }
    - database

# Ansible Vault for secrets
ansible-vault create secrets.yml
ansible-vault edit secrets.yml
ansible-vault encrypt existing_file.yml
ansible-vault decrypt file.yml

# Run with vault
ansible-playbook playbook.yml --ask-vault-pass
ansible-playbook playbook.yml --vault-password-file vault_pass.txt

# Conditional execution
- name: Install package on Ubuntu
  apt:
    name: nginx
    state: present
  when: ansible_distribution == "Ubuntu"

# Loops
- name: Install packages
  package:
    name: "{{ item }}"
    state: present
  loop:
    - nginx
    - mysql-server
    - php-fpm

# Error handling
- name: Start service
  systemd:
    name: nginx
    state: started
  rescue:
    - name: Log failure
      debug:
        msg: "Failed to start nginx"
  always:
    - name: Check service status
      command: systemctl status nginx
```

### Ansible Best Practices
```yaml
# Directory structure
ansible-project/
├── ansible.cfg
├── inventory/
│   ├── production
│   └── staging
├── group_vars/
├── host_vars/
├── playbooks/
├── roles/
└── vault/

# ansible.cfg configuration
[defaults]
inventory = ./inventory
remote_user = ansible
private_key_file = ~/.ssh/ansible_key
host_key_checking = False
retry_files_enabled = False
gathering = smart
fact_caching = jsonfile
fact_caching_connection = /tmp/ansible_fact_cache

[ssh_connection]
ssh_args = -o ControlMaster=auto -o ControlPersist=60s
pipelining = True
```

## Puppet

### Puppet Installation and Setup
```bash
# Install Puppet Server (on master)
wget https://apt.puppetlabs.com/puppet7-release-focal.deb
sudo dpkg -i puppet7-release-focal.deb
sudo apt update
sudo apt install puppetserver

# Install Puppet Agent (on nodes)
sudo apt install puppet-agent

# Start Puppet Server
sudo systemctl start puppetserver
sudo systemctl enable puppetserver

# Configure Puppet Agent
sudo vim /etc/puppetlabs/puppet/puppet.conf
[main]
certname = client.example.com
server = puppet.example.com
```

### Puppet Manifests
```puppet
# Basic manifest (site.pp)
node 'web1.example.com' {
  include webserver
}

node 'db1.example.com' {
  include database
}

node default {
  include common
}

# Resource declarations
file { '/etc/motd':
  ensure  => file,
  content => "Welcome to ${fqdn}\n",
  owner   => 'root',
  group   => 'root',
  mode    => '0644',
}

package { 'nginx':
  ensure => installed,
}

service { 'nginx':
  ensure     => running,
  enable     => true,
  require    => Package['nginx'],
  subscribe  => File['/etc/nginx/nginx.conf'],
}

user { 'deploy':
  ensure     => present,
  home       => '/home/deploy',
  shell      => '/bin/bash',
  managehome => true,
}

# Conditional logic
if $operatingsystem == 'Ubuntu' {
  package { 'apache2':
    ensure => installed,
  }
} elsif $operatingsystem == 'CentOS' {
  package { 'httpd':
    ensure => installed,
  }
}
```

### Puppet Modules
```puppet
# Module structure
modules/
└── nginx/
    ├── manifests/
    │   ├── init.pp
    │   ├── config.pp
    │   └── service.pp
    ├── templates/
    │   └── nginx.conf.erb
    ├── files/
    └── tests/

# nginx/manifests/init.pp
class nginx (
  $port = 80,
  $docroot = '/var/www/html',
) {
  
  package { 'nginx':
    ensure => installed,
  }
  
  file { '/etc/nginx/nginx.conf':
    ensure  => file,
    content => template('nginx/nginx.conf.erb'),
    require => Package['nginx'],
    notify  => Service['nginx'],
  }
  
  service { 'nginx':
    ensure     => running,
    enable     => true,
    hasrestart => true,
    hasstatus  => true,
    require    => Package['nginx'],
  }
}

# Using modules
include nginx

class { 'nginx':
  port    => 8080,
  docroot => '/var/www/mysite',
}
```

### Puppet Templates and Files
```erb
# nginx.conf.erb template
user www-data;
worker_processes <%= @processors %>;
pid /run/nginx.pid;

events {
    worker_connections 768;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    server {
        listen <%= @port %>;
        server_name <%= @fqdn %>;
        root <%= @docroot %>;
        index index.html index.php;
        
        location / {
            try_files $uri $uri/ =404;
        }
    }
}
```

### Puppet Agent Operations
```bash
# Run Puppet agent
sudo puppet agent --test
sudo puppet agent --test --noop        # Dry run

# Certificate management
sudo puppet cert list                  # List certificates (on master)
sudo puppet cert sign client.example.com
sudo puppet cert clean client.example.com

# Agent configuration
puppet config print                    # Show configuration
puppet config set server puppet.example.com
puppet config set runinterval 30m
```

### Hiera (Puppet Data Lookup)
```yaml
# hiera.yaml
---
version: 5
defaults:
  datadir: data
  data_hash: yaml_data

hierarchy:
  - name: "Per-node data"
    path: "nodes/%{trusted.certname}.yaml"
  
  - name: "Per-OS family"
    path: "family/%{facts.os.family}.yaml"
  
  - name: "Common data"
    path: "common.yaml"

# data/common.yaml
---
nginx::port: 80
nginx::docroot: '/var/www/html'

# data/nodes/web1.example.com.yaml
---
nginx::port: 8080
nginx::docroot: '/var/www/mysite'

# Using Hiera in manifests
class nginx (
  $port = lookup('nginx::port'),
  $docroot = lookup('nginx::docroot'),
) {
  # class implementation
}
```

## CI/CD with Jenkins

### Jenkins Installation
```bash
# Install Jenkins (Ubuntu/Debian)
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

# Access Jenkins at http://localhost:8080
```

### Jenkins Pipeline (Jenkinsfile)
```groovy
// Declarative Pipeline
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-registry.com'
        APP_NAME = 'myapp'
        APP_VERSION = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/yourorg/myapp.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'make build'
                sh 'make test'
            }
        }
        
        stage('Code Quality') {
            steps {
                sh 'sonar-scanner'
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    def image = docker.build("${DOCKER_REGISTRY}/${APP_NAME}:${APP_VERSION}")
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                ansiblePlaybook(
                    playbook: 'deploy.yml',
                    inventory: 'staging',
                    extraVars: [
                        app_version: "${APP_VERSION}",
                        environment: 'staging'
                    ]
                )
            }
        }
        
        stage('Integration Tests') {
            steps {
                sh 'pytest tests/integration/'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input 'Deploy to production?'
                ansiblePlaybook(
                    playbook: 'deploy.yml',
                    inventory: 'production',
                    extraVars: [
                        app_version: "${APP_VERSION}",
                        environment: 'production'
                    ]
                )
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            slackSend(
                channel: '#deployments',
                message: "✅ Deployment successful: ${APP_NAME} v${APP_VERSION}"
            )
        }
        failure {
            slackSend(
                channel: '#deployments',
                message: "❌ Deployment failed: ${APP_NAME} v${APP_VERSION}"
            )
        }
    }
}

// Scripted Pipeline example
node {
    stage('Checkout') {
        checkout scm
    }
    
    stage('Build') {
        sh 'docker build -t myapp .'
    }
    
    stage('Test') {
        sh 'docker run --rm myapp npm test'
    }
    
    stage('Deploy') {
        if (env.BRANCH_NAME == 'main') {
            sh 'docker push myapp:latest'
            sh 'kubectl apply -f k8s/'
        }
    }
}
```

## GitLab CI/CD

### GitLab CI Configuration (.gitlab-ci.yml)
```yaml
# GitLab CI/CD Pipeline
stages:
  - build
  - test
  - security
  - deploy-staging
  - deploy-production

variables:
  DOCKER_REGISTRY: registry.gitlab.com
  DOCKER_IMAGE: $CI_REGISTRY_IMAGE
  KUBECONFIG: /etc/kubectl/config

# Build stage
build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $DOCKER_IMAGE:$CI_COMMIT_SHA .
    - docker push $DOCKER_IMAGE:$CI_COMMIT_SHA
    - docker tag $DOCKER_IMAGE:$CI_COMMIT_SHA $DOCKER_IMAGE:latest
    - docker push $DOCKER_IMAGE:latest

# Test stages
unit-tests:
  stage: test
  image: node:16
  script:
    - npm ci
    - npm run test:unit
  coverage: '/Coverage: \d+\.\d+%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

integration-tests:
  stage: test
  image: docker:latest
  services:
    - docker:dind
    - postgres:13
  variables:
    POSTGRES_DB: testdb
    POSTGRES_USER: testuser
    POSTGRES_PASSWORD: testpass
  script:
    - docker run --rm --network host $DOCKER_IMAGE:$CI_COMMIT_SHA npm run test:integration

# Security scanning
security-scan:
  stage: security
  image: owasp/zap2docker-stable
  script:
    - zap-baseline.py -t http://staging.example.com
  artifacts:
    reports:
      sast: gl-sast-report.json
  only:
    - main
    - develop

# Deployment stages
deploy-staging:
  stage: deploy-staging
  image: alpine/helm:latest
  before_script:
    - kubectl config use-context staging
  script:
    - helm upgrade --install myapp-staging ./helm/myapp
        --set image.tag=$CI_COMMIT_SHA
        --set environment=staging
        --namespace staging
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy-production:
  stage: deploy-production
  image: alpine/helm:latest
  before_script:
    - kubectl config use-context production
  script:
    - helm upgrade --install myapp-prod ./helm/myapp
        --set image.tag=$CI_COMMIT_SHA
        --set environment=production
        --namespace production
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
    - main

# Include external pipeline templates
include:
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Dependency-Scanning.gitlab-ci.yml
  - template: Security/Container-Scanning.gitlab-ci.yml
```

## GitHub Actions

### GitHub Actions Workflow (.github/workflows/ci-cd.yml)
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}

  security:
    runs-on: ubuntu-latest
    needs: build
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
    
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [build, security]
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
    - name: Deploy to staging
      uses: azure/k8s-deploy@v1
      with:
        manifests: |
          k8s/deployment.yaml
          k8s/service.yaml
        images: |
          ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
        namespace: staging

  deploy-production:
    runs-on: ubuntu-latest
    needs: [build, security]
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Deploy to production
      uses: azure/k8s-deploy@v1
      with:
        manifests: |
          k8s/deployment.yaml
          k8s/service.yaml
        images: |
          ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
        namespace: production
```

## Infrastructure as Code

### Terraform with Ansible
```hcl
# Terraform configuration (main.tf)
provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "web_servers" {
  count         = 3
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t3.micro"
  key_name      = "my-key"
  
  vpc_security_group_ids = [aws_security_group.web.id]
  
  tags = {
    Name = "web-server-${count.index + 1}"
    Role = "webserver"
  }
  
  provisioner "local-exec" {
    command = "echo '${self.public_ip}' >> inventory.ini"
  }
}

resource "aws_security_group" "web" {
  name_description = "Web server security group"
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "web_server_ips" {
  value = aws_instance.web_servers[*].public_ip
}

# Local provisioner to run Ansible
resource "null_resource" "ansible_provisioner" {
  depends_on = [aws_instance.web_servers]
  
  provisioner "local-exec" {
    command = "ansible-playbook -i inventory.ini configure-web-servers.yml"
  }
}
```

### Docker Compose for Development
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: 
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://user:pass@db:5432/myapp
    depends_on:
      - db
      - redis

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app

volumes:
  postgres_data:
```

## Monitoring and Observability

### Prometheus and Grafana with Ansible
```yaml
# prometheus.yml playbook
---
- name: Install Prometheus
  hosts: monitoring
  become: yes
  
  tasks:
    - name: Create prometheus user
      user:
        name: prometheus
        system: yes
        shell: /bin/false
        home: /var/lib/prometheus
    
    - name: Download Prometheus
      get_url:
        url: https://github.com/prometheus/prometheus/releases/download/v2.40.0/prometheus-2.40.0.linux-amd64.tar.gz
        dest: /tmp/prometheus.tar.gz
    
    - name: Extract Prometheus
      unarchive:
        src: /tmp/prometheus.tar.gz
        dest: /tmp
        remote_src: yes
    
    - name: Copy Prometheus binaries
      copy:
        src: /tmp/prometheus-2.40.0.linux-amd64/{{ item }}
        dest: /usr/local/bin/
        owner: prometheus
        group: prometheus
        mode: '0755'
        remote_src: yes
      loop:
        - prometheus
        - promtool
    
    - name: Create Prometheus directories
      file:
        path: "{{ item }}"
        state: directory
        owner: prometheus
        group: prometheus
        mode: '0755'
      loop:
        - /etc/prometheus
        - /var/lib/prometheus
    
    - name: Copy Prometheus configuration
      template:
        src: prometheus.yml.j2
        dest: /etc/prometheus/prometheus.yml
        owner: prometheus
        group: prometheus
        mode: '0644'
      notify: restart prometheus
    
    - name: Create Prometheus systemd service
      template:
        src: prometheus.service.j2
        dest: /etc/systemd/system/prometheus.service
      notify:
        - reload systemd
        - restart prometheus
    
    - name: Start and enable Prometheus
      systemd:
        name: prometheus
        state: started
        enabled: yes
  
  handlers:
    - name: reload systemd
      systemd:
        daemon_reload: yes
    
    - name: restart prometheus
      systemd:
        name: prometheus
        state: restarted
```

### Application Deployment Pipeline
```yaml
# Complete application deployment playbook
---
- name: Deploy application
  hosts: webservers
  become: yes
  serial: 1  # Rolling deployment
  max_fail_percentage: 0
  
  vars:
    app_name: myapp
    app_version: "{{ app_version | default('latest') }}"
    app_port: 3000
    health_check_url: "http://localhost:{{ app_port }}/health"
    
  pre_tasks:
    - name: Check if service is healthy before deployment
      uri:
        url: "{{ health_check_url }}"
        method: GET
        status_code: 200
      register: health_check
      failed_when: false
      when: inventory_hostname in groups['webservers'][1:]
  
  tasks:
    - name: Pull latest application image
      docker_image:
        name: "{{ docker_registry }}/{{ app_name }}"
        tag: "{{ app_version }}"
        source: pull
        force_source: yes
    
    - name: Stop old container
      docker_container:
        name: "{{ app_name }}"
        state: stopped
      ignore_errors: yes
    
    - name: Remove old container
      docker_container:
        name: "{{ app_name }}"
        state: absent
    
    - name: Start new container
      docker_container:
        name: "{{ app_name }}"
        image: "{{ docker_registry }}/{{ app_name }}:{{ app_version }}"
        state: started
        restart_policy: always
        ports:
          - "{{ app_port }}:{{ app_port }}"
        env:
          NODE_ENV: production
          DATABASE_URL: "{{ database_url }}"
          REDIS_URL: "{{ redis_url }}"
        healthcheck:
          test: ["CMD", "curl", "-f", "{{ health_check_url }}"]
          interval: 30s
          timeout: 10s
          retries: 3
    
    - name: Wait for application to be healthy
      uri:
        url: "{{ health_check_url }}"
        method: GET
        status_code: 200
      register: result
      until: result.status == 200
      retries: 30
      delay: 10
    
    - name: Run smoke tests
      uri:
        url: "http://localhost:{{ app_port }}/{{ item }}"
        method: GET
        status_code: 200
      loop:
        - health
        - api/status
        - api/version
  
  post_tasks:
    - name: Update load balancer
      uri:
        url: "{{ load_balancer_api }}/servers/{{ inventory_hostname }}/enable"
        method: POST
        headers:
          Authorization: "Bearer {{ lb_token }}"
      delegate_to: localhost
      run_once: true
    
    - name: Clean up old Docker images
      docker_prune:
        images: yes
        images_filters:
          dangling: false
          until: "24h"
```

