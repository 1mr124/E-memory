export default async function uploadImage() {
    try {
        const file = await openFilePicker(); 
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Image upload failed');

        const data = await response.json();
        return data.imageUrl; // or another field from the response
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

async function openFilePicker() {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = () => resolve(input.files[0]);
        input.click();
    });
}
