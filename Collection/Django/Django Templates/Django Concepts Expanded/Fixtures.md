
### Adding Initial Values to a Model

1. **Export Existing Data:**  
    Run the following command to export data from the `courses` app:
    
    ```bash
    python manage.py dumpdata courses --indent=2
    ```
    
2. **Organize Fixture Files:**  
    Create a directory for fixtures within the `courses` app:
    
    ```bash
    mkdir courses/fixtures
    ```
    
3. **Save Exported Data to a Fixture File:**  
    Export the data again, this time directing the output to the newly created fixtures folder:
    
    ```bash
    python manage.py dumpdata courses --indent=2 --output=courses/fixtures/subjects.json
    ```
    
4. **Clear Existing Data:**  
    Delete all existing records from the relevant models to prepare for fresh data loading.
    
5. **Load Initial Data:**  
    Import the data back into the database using:
    
    ```bash
    python manage.py loaddata courses/fixtures/subjects.json
    ```
    

---

### Additional Notes

- By default, Django looks for fixture files in the `fixtures/` directory of each app.
- You can specify the full path to the fixture file when using the `loaddata` command.
- To include custom directories for fixtures, configure the `FIXTURE_DIRS` setting in your Django project.
- Fixtures are valuable not only for initializing data but also for:
    - Providing sample data during development
    - Supplying required data for testing
    - Populating essential data in production environments