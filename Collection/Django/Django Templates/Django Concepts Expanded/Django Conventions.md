```markdown
- `urls.py`: 
Each Django application should have a `urls.py` file that contains all the routing logic for the given application.

- `api.py`: 
We should add a definition for all the APIs in the `api.py` file and link it to `urls.py`. A lot of developers also use `views.py` for the same purpose.

- `constants.py`: 
We should use the `constants.py` file to add all the constants used in our Django application.

- `models.py`: 
We should put all our database table definitions in our `models.py` file. Django already mandates the use of a `models.py` file for any database definition-related code.

- `serializers.py`: 
Add all the DRF serializer logic inside the `serializers.py` file. Avoid adding serializer logic inside the model file to maintain a separation of concern.

- `common.py`: 
A lot of the time, we might see the repetition of logic in the same Django app. It is better to create a `common.py` file that contains all the common logic used by the application.

- `utils.py`: 
As we build applications, we write a lot of utility functions to perform certain operations. For example, if we wanted to trim whitespace from an article, we would create a `util` function for this purpose and put that function in the `utils.py` file so that it can be reused. The main difference between `common.py` and `utils.py` is that `common.py` can be dependent on other files, such as `models.py`, but `utils.py` should not be dependent on other files.

- `public.py`: 
As our project matures, we shall observe interdependency between different Django applications. It is important to maintain a hierarchy in files to have a smooth developer experience. We should keep all functions and classes that need to be accessed by other Django apps in the `public.py` file.

- `_private.py`: 
We should keep all the code that should be accessible only by the internal Django app in the `_private.py` file. The primary difference between `public.py` and `_private.py` files is that public file functions can be accessed by any other Django app and private functions should only be accessed by files in the same Django app. Public functions can internally call private functions and they can have a wrapper around the private function to expose the function to another Django app.

- `tasks.py`: 
We learned how to use Celery in [_Chapter 8_](https://subscription.packtpub.com/book/web-development/9781804610480/8). As mentioned in that chapter, we should put all our Celery task code in the `tasks.py` file.

- `signals.py`: 
Add all the custom Django signal definitions to the `signals.py` file.

- `receivers.py`: 
Add all the Django receiver-related code to the `receivers.py` file.

- `admin.py`: 
Out of the box, Django provides a very useful admin interface. All the code related to Django admin should be inside the `admin.py` file.

- `tests`: 
In [_Chapter 9_](https://subscription.packtpub.com/book/web-development/9781804610480/9), we saw how we should utilize `factoryboy` and `tests` files to write tests in Django. All the tests should go inside the `tests` folder.
```


## Settings File For Production
```markdown
- `settings/base.py`: 
This file would contain all the common Django settings that would be applicable for all the environments, for example, `INSTALLED_APPS`.
- `settings/local.py`: 
This would contain all the configurations to run Django for local development. We need to import all the settings in the `base.py` file to `local.py`.
- `settings/prod.py`: 
This would contain all the configurations to run Django in production. Similarly, we would import all the settings from the `base.py` file.
```