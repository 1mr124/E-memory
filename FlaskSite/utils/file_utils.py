import os

from flask import current_app


@staticmethod
def allowed_file(filename):
    """Check if a file has an allowed extension."""
    allowed_extensions = {"png", "jpg", "jpeg", "gif", "bmp", "tiff", "webp"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_extensions


@staticmethod
def save_file(file_dir, file, filename):
    file_path = os.path.join(current_app.root_path, file_dir, filename)

    # Ensure the directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # Save the file
    file.save(file_path)


def remove_file(file_dir, filename):
    try:
        file_path = os.path.join(current_app.root_path, file_dir, filename)
        os.remove(file_path)
    except Exception as e:
        print(f"unable to remove file {filename} in directory {file_dir} due to {e}")
