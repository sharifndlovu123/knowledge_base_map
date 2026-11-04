# 02. Wave Terminal

Wave Terminal is an open-source terminal for macOS, Linux and Windows that mixes a normal shell with graphical blocks, so files, web pages and an AI assistant can sit next to your shells in the same window. It is the heavier, more visual alternative to [[tmux]].

> Status: being tried alongside tmux. The notes below come from the official documentation (docs.waveterm.dev); personal impressions are added as they form.

## What it offers

- **Widgets and blocks**: built-in graphical tools that sit beside terminals, such as file previews and a web browser. Custom widgets are possible.
- **`wsh`**: a command line tool that controls Wave from inside a shell (open widgets, send things to blocks).
- **Remote connections**: connect to another machine over SSH in one step, with the same window layout.
- **Wave AI**: an assistant that can see terminal output, widgets and the filesystem. Works with local models and your own API keys.
- **Workspaces, tabs and layouts**: arrange terminals and widgets and save the arrangement.
- **Durable sessions**: sessions that survive disconnects, covering one of the main reasons people reach for tmux.
- **Customisation and secrets**: themes, settings and a place to store secrets.

## tmux vs Wave

| | tmux | Wave Terminal |
|---|------|---------------|
| What it is | Program that runs inside any terminal | Terminal application with its own window |
| Runs on a bare server over SSH | Yes, only needs a shell | No, it is a desktop app (it connects *to* servers) |
| Interface | Keyboard, text only | Keyboard and mouse, graphical blocks |
| Extras | Plugins, scripting | Previews, browser, AI built in |
| Weight | Tiny, installed almost everywhere | Large desktop app |
| Learning curve | Key bindings to learn | Mostly discoverable |

## Which to use

- On servers and over SSH: tmux, since it is already there and survives dropped connections.
- On a desktop for day-to-day work: Wave is worth trying for the previews and layouts.
- They can be combined: Wave as the terminal, tmux inside it when connected to a server.

## Install

Download from [waveterm.dev/download](https://waveterm.dev/download); the Getting Started guide lists the packages for each system and the key bindings reference lists the shortcuts.

## Notes from testing

- (add findings here: what works well, what is missing, how it compares day to day)
