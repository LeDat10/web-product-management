export const handlePickerCallback = (callback, value, meta) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');

    // Kiểm tra loại file
    if (meta.filetype === 'image') {
        input.setAttribute('accept', 'image/*'); // Chỉ chấp nhận ảnh
    } else if (meta.filetype === 'media') {
        input.setAttribute('accept', 'video/*'); // Chỉ chấp nhận video
    }

    input.onchange = async (e) => {
        const file = e.target.files[0];

        if (file) {
            // 👉 Nếu bạn muốn upload lên server, gọi API ở đây
            const reader = new FileReader();
            reader.onload = () => {
                callback(reader.result, { title: file.name }); // Hiển thị ảnh ngay trong TinyMCE
            };
            reader.readAsDataURL(file);
        }
    };

    input.click(); // Mở file picker
};