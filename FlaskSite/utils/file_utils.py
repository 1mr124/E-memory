import os
from flask import current_app




@staticmethod
def allowed_file(filename):
    """Check if a file has an allowed extension."""
    allowed_extensions = {"png", "jpg", "jpeg", "gif", "bmp", "tiff", "webp"} # Move it outside the function and give it as parameter for more reusability  
    return "." in filename and filename.rsplit(
        ".", 1)[1].lower() in allowed_extensions


@staticmethod
def save_file(file_dir, file, filename):
    file_path = os.path.join(current_app.root_path, file_dir, filename)

    # Ensure the directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # Save the file
    try:
        file.save(file_path)
        return True  # Indicate success
    except Exception as e:
        print(f"Error saving file {filename}: {e}")
        return False  # Indicate failure

@staticmethod
def remove_file(file_dir, filename):
    try:
        file_path = os.path.join(current_app.root_path, file_dir, filename)
        os.remove(file_path)
        return True
    except FileNotFoundError:
        print(f"File {filename} not found in {file_dir}.")
        return False
    except Exception as e:
        print(f"Unable to remove file {filename} in directory {file_dir} due to {e}")
        return False
    

@staticmethod
def createNewFolder(folderPath):
    """
    Attempt to create a new folder at the specified path.

    Argument:
        folderPath: Path to the folder to create.

    Returns:
        True: Folder has been created.
        False: Folder already exists or an error occurred during creation.
    """
    try:
        if not fileExists(folderPath):
            os.makedirs(folderPath, exist_ok=True)
            print(f"Folder created at {folderPath}")
            return True  # Folder created successfully
    except OSError as e:
        print(f"Error creating folder {folderPath}: {e}")
        return False  # Indicate failure



@staticmethod
def createNewEmptyFile(filePath):
    """
    Create a new empty file.
    
    Argument:
        filePath: Path to create the file.

    Returns:
        True: File has been created.
        False: File already exists or an error occurred during creation.
    """
    try:
        if not fileExists(filePath):
            with open(filePath, 'w') as f:
                pass  # Create an empty file
            return True
        else:
            return False  # File already exists; so it has content, not empty
    except OSError as e:
        print(f"Error creating file {filePath}: {e}")
        return False  # Indicate failure due to an exception
    


@staticmethod
def writeToFile(filePath, content):
    """
    Ensure the file exists, then write (append) content to it.
    
    Argument:
        filePath: Path to the file where content will be written.
        content: Content to be appended to the file.
    
    Returns:
        True: Content was successfully written.
        False: An error occurred during the write operation.
    """
    # Get the directory name from the file path
    dirName = os.path.dirname(filePath)
    
    # If there's a directory, ensure it exists
    if dirName:
        os.makedirs(dirName, exist_ok=True)
    
    # Create the file if it doesn't exist
    if not fileExists(filePath):
        creationResult = createNewEmptyFile(filePath)
        if not creationResult:
            # Handle the case where the file couldn't be created
            print(f"Error: Unable to create the file at {filePath}.")
            return False  # Stop further execution if file creation fails

    # Append content to the file
    try:
        with open(filePath, 'a') as f:
            f.write(content)
        return True  # Successfully wrote content
    except OSError as e:
        print(f"Error writing to file {filePath}: {e}")
        return False  # Indicate failure
    


@staticmethod
def fileExists(filePath):
    """
    Check if a file exists at the specified path.
    
    Argument:
        filePath: Path to the file.

    Returns:
        True: If the file exists.
        False: If the file does not exist.
    """
    return os.path.exists(filePath)

