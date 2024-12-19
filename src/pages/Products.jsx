import React, { useState, useEffect } from 'react';
import { db } from "../firebase/config";
import Swal from 'sweetalert2';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { Edit, Trash, PackagePlus } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsCollectionRef = collection(db, 'products');
                const snapshot = await getDocs(productsCollectionRef);
                const productsList = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                    };
                });
                setProducts(productsList)
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };
        fetchProducts();
    }, []);

    const handleAdd = async () => {
        Swal.fire({
            title: 'Thêm sách',
            html: `
                <label>ID:</label><br>
                    <span id="id">${products[products.length - 1].id + 1}</span>
                <label>Tên sách:</label><br>
                    <input id="bookName" class="swal2-input" style="width: 80%;" /><br/>
                <label>Thể loại</label><br>
                    <input id="category" class="swal2-input" style="width: 80%;"  /><br/>
                <label>Tuổi:</label><br>
                    <input id="age" type="number" class="swal2-input" style="width: 80%;"  /><br/>
                <label>Giá:</label><br>
                    <input id="price" type="number" class="swal2-input" style="width: 80%;"  /><br/>
                <label>Tác giả:</label><br>
                    <input id="author" class="swal2-input" style="width: 80%;"  /><br/>
                <label>Mô tả:</label><br>
                    <textarea id="title" class="swal2-textarea" style="width: 80%;"></textarea><br/>
                <label>Địa chỉ hình ảnh:</label><br>
                    <input id="image" class="swal2-input" style="width: 80%;"  /><br/>
            `,
            showCancelButton: true,
            confirmButtonText: 'Lưu',
            cancelButtonText: 'Hủy',
            preConfirm: () => {
                const id = Swal.getPopup().querySelector('#id').value;
                const bookName = Swal.getPopup().querySelector('#bookName').value;
                const category = Swal.getPopup().querySelector('#category').value;
                const age = Swal.getPopup().querySelector('#age').value;
                const price = parseInt(Swal.getPopup().querySelector('#price').value);
                const author = Swal.getPopup().querySelector('#author').value;
                const title = Swal.getPopup().querySelector('#title').value;
                const image = Swal.getPopup().querySelector('#image').value;

                return { id, bookName, category, age, author, price, title, image };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const newProduct = result.value;
                try {
                    // Cập nhật dữ liệu trong Firestore
                    await addDoc(collection(db, "productFood"), newProduct);
                    // Cập nhật state
                    setProducts([...products, { ...newProduct }]);
                    Swal.fire('Thành công!', 'Sản phẩm đã được thêm', 'success');
                } catch (error) {
                    console.error("Error updating product: ", error);
                    Swal.fire('Thất bại', 'Có lỗi xảy ra trong quá trình cập nhật', 'error');
                }
            }
        });
    }

    const handleEdit = async (item) => {
        Swal.fire({
            title: 'Chỉnh sửa thông tin sản phẩm',
            html: `
                <label>ID:</label><br>
                    <input id="id" class="swal2-input" style="width: 80%;" disable value="${item.id}" /><br/>
                <label>Tên sách:</label><br>
                    <input id="bookName" class="swal2-input" style="width: 80%;" value="${item.bookName}" /><br/>
                <label>Thể loại</label><br>
                    <input id="category" class="swal2-input" style="width: 80%;" value="${item.category}"  /><br/>
                <label>Tuổi:</label><br>
                    <input id="age" type="number" class="swal2-input" style="width: 80%;" value="${item.age}"  /><br/>
                <label>Giá:</label><br>
                    <input id="price" type="number" class="swal2-input" style="width: 80%;" value="${item.price}"  /><br/>
                <label>Tác giả:</label><br>
                    <input id="author" class="swal2-input" style="width: 80%;" value="${item.author}"  /><br/>
                <label>Mô tả:</label><br>
                    <textarea id="title" class="swal2-textarea" style="width: 80%;">${item.title}</textarea><br/>
                <label>Địa chỉ hình ảnh:</label><br>
                    <input id="image" class="swal2-input" style="width: 80%;" value="${item.image}"  /><br/>
            `,
            showCancelButton: true,
            confirmButtonText: 'Lưu',
            cancelButtonText: 'Hủy',
            preConfirm: () => {
                const idElement = Swal.getPopup().querySelector('#id');
                const bookNameElement = Swal.getPopup().querySelector('#bookName');
                const categoryElement = Swal.getPopup().querySelector('#category');
                const ageElement = Swal.getPopup().querySelector('#age');
                const priceElement = Swal.getPopup().querySelector('#price');
                const authorElement = Swal.getPopup().querySelector('#author');
                const titleElement = Swal.getPopup().querySelector('#title');
                const imageElement = Swal.getPopup().querySelector('#image');
            
                if (!idElement || !bookNameElement || !categoryElement || !ageElement || !priceElement || !authorElement || !titleElement || !imageElement) {
                    Swal.showValidationMessage('Vui lòng điền đầy đủ thông tin');
                    return false;
                }
            
                const id = idElement.value;
                const bookName = bookNameElement.value;
                const category = categoryElement.value;
                const age = ageElement.value;
                const price = parseInt(priceElement.value);
                const author = authorElement.value;
                const title = titleElement.value;
                const image = imageElement.value;
            
                return { id, bookName, category, age, author, price, title, image };
            }
        }).then(async (result) => {
            console.log(result);
            if (result.isConfirmed) {
                const updatedData = result.value;
                
                try {
                    // Cập nhật state
                    setProducts(products.map((prod) => (prod.id === item.id ? { ...prod, ...updatedData } : prod)));
                    await updateDoc(doc(db, "products", item.id), { ...updatedData });
                    Swal.fire('Thành công!', 'Sản phẩm đã được cập nhật.', 'success');
                } catch (error) {
                    console.error("Error updating product: ", error);
                    Swal.fire('Thất bại', 'Có lỗi xảy ra trong quá trình cập nhật', 'error');
                }
            }
        });
    };

    const handleDelete = async (item) => {
        Swal.fire({
            title: `Xác nhận?`,
            text: `Xác nhận xóa ${item.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'OK',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setProducts(products.filter(i => i.id !== item.id));
                    await deleteDoc(doc(db, "products", item.id));
                    Swal.fire('Thành công!', 'Sản phẩm này đã xóa', 'success');
                } catch (error) {
                    console.error("Error deleting user: ", error);
                    Swal.fire('Thất bại', 'Đã xảy ra lỗi nào đó', 'error');

                }
            }
        });
    };

    return (
        <div style={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={styles.text}>Quản lý sản phẩm</h1>
                <button style={styles.addButton} onClick={() => handleAdd()}><PackagePlus size={16} />Thêm sản phẩm mới</button>
            </div>

            {products.length === 0 ? (
                <h1>Không tìm thấy sản phẩm nào</h1>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableRow}>
                            <th>Tên sản phẩm</th>
                            <th>Hình ảnh</th>
                            <th>Giá</th>
                            <th>Xử lý dữ liệu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(item => (
                            <tr key={item.id} style={styles.tableRow}>
                                <td style={{ ...styles.text, ...styles.tableCell }}>{item.bookName}</td>
                                <td style={{ ...styles.text, ...styles.tableCell }}>
                                    <img
                                        src={item.image || "https://via.placeholder.com/32"}
                                        alt={item.bookName}
                                        style={styles.avatar}
                                    />
                                </td>
                                <td style={{ ...styles.text, ...styles.tableCell }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                </td>
                                <td style={{ ...styles.actions, ...styles.tableCell }}>
                                    <button style={styles.actionButton} onClick={() => handleEdit(item)}>
                                        <Edit size={20} color='black' />
                                    </button>
                                    <button style={styles.actionButton} onClick={() => handleDelete(item)}>
                                        <Trash size={20} color='red' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Products;

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '20px',
        height: '100%',
        minHeight: '100vh',
    },
    text: {
        color: '#000',
    },
    addButton: {
        marginTop: '10px',
        marginBottom: '20px',
        padding: '8px 16px',
        borderColor: '#4CAF50',
        color: 'black',
        backgroundColor: '#f7f7f7',
        border: '10',
        borderRadius: '4px',
        cursor: 'pointer',
        alignItems: 'center',
    },
    avatar: {
        width: '80px',
        height: '80px',
    },
    table: {
        width: '100%',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 150px)',
        borderCollapse: 'collapse', // Thêm thuộc tính này để xóa khoảng cách giữa các ô
    },
    tableRow: {
        minHeight: '60px', // Giảm chiều cao tối thiểu
        textAlign: 'center', // Căn giữa nội dung
        borderBottom: '1px solid #ccc',
        color: '#000',
        margin: '0', // Đặt margin bằng 0 để không có khoảng cách giữa các hàng
    },
    actions: {
        display: 'flex',
        justifyContent: 'center',
        height: '80px',
    },
    actionButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
    },
    tableCell: {
        padding: '10px', // Thêm padding cho các ô
        textAlign: 'center', // Căn giữa nội dung trong ô
    },
};