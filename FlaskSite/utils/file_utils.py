import os
from flask import current_app


# Mr12 wanna make it OOP 😂

@staticmethod
def allowed_file(filename):
    """Check if a file has an allowed extension."""
    allowed_extensions = {"png", "jpg", "jpeg", "gif", "bmp", "tiff", "webp"}
    return "." in filename and filename.rsplit(
        ".", 1)[1].lower() in allowed_extensions


@staticmethod
def save_file(file_dir, file, filename):
    file_path = os.path.join(current_app.root_path, file_dir, filename)

    # Ensure the directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # Save the file
    file.save(file_path)

@staticmethod
def remove_file(file_dir, filename):
    try:
        file_path = os.path.join(current_app.root_path, file_dir, filename)
        os.remove(file_path)
    except Exception as e:
        print(
            f"unable to remove file {filename} in directory {file_dir} due to {e}")


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
        if not os.path.exists(folderPath):
            os.makedirs(folderPath, exist_ok=True)
            print(f"Folder created at {folderPath}")
            return True  # Folder created successfully
        else:
            return False  # Folder already exists
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
        if not os.path.exists(filePath):
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
    if not os.path.exists(filePath):
        createNewEmptyFile(filePath)
    
    # Write (append) content to the file
    print("writing to ",filePath)
    try:
        with open(filePath, 'a') as f:
            f.write(content)
        return True  # Successfully wrote content
    except OSError as e:
        print(f"Error writing to file {filePath}: {e}")
        return False  # Indicate failure