import React, { useState, useEffect } from 'react';
import { auth, db } from "../firebase/config";
import Swal from 'sweetalert2';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { Edit, Trash, PackagePlus } from 'lucide-react';

const User = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userRef = collection(db, 'users');
                const snapshot = await getDocs(userRef);
                const userList = snapshot.docs.map((doc, index) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        index: index + 1,
                    };
                });
                setUsers(userList)
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };
        fetchUsers();
    }, []);

    const handleAdd = async () => {
        Swal.fire({
            title: 'Thêm người dùng',
            html: 
                `<div style="text-align: left; margin-bottom: 10px;">
                    <label style="display: block; font-weight: bold;">Tuổi</label>
                    <input id="swal-input1" class="swal2-input" placeholder="Tuổi" style="width: 80%;">
                </div>` +
                `<div style="text-align: left; margin-bottom: 10px;">
                    <label style="display: block; font-weight: bold;">Name</label>
                    <input id="swal-input2" class="swal2-input" placeholder="Name" style="width: 80%;">
                </div>` +
                `<div style="text-align: left; margin-bottom: 10px;">
                    <label style="display: block; font-weight: bold;">Email</label>
                    <input id="swal-input3" class="swal2-input" placeholder="Email" style="width: 80%;">
                </div>` +
                `<div style="text-align: left; margin-bottom: 10px; position: relative; justifyContent: 'center'; alignItems: 'center',">
                    <label style="display: block; font-weight: bold;">Mật khẩu</label>
                    <input id="swal-input4" type="password" class="swal2-input" placeholder="Mật khẩu" style="width: 80%; padding-right: 30px;">
                </div>`,
            showCancelButton: true,
            confirmButtonText: 'Lưu',
            cancelButtonText: 'Hủy',
            preConfirm: () => {
                const age = parseInt(Swal.getPopup().querySelector('swal-input1').value);
                const displayName = Swal.getPopup().querySelector('swal-input2').value;
                const email = Swal.getPopup().querySelector('swal-input3').value;
                const password = Swal.getPopup().querySelector('swal-input4').value;
                return { age, displayName, email, password };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const newUser = result.value;
                try {
                    await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
                    await addDoc(collection(db, "users"), newUser);
                    setUsers([...users, { ...newUser }]);
                    Swal.fire('Thành công!', 'Người dùng đã được thêm.', 'success');
                } catch (error) {
                    console.error("Error adding user: ", error);
                    Swal.fire('Lỗi', 'Không thể thêm người dùng.', 'error');
                }
            }
        });
    }

    const handleEdit = async (item) => {
        Swal.fire({
            title: 'Chỉnh sửa thông tin người dùng',
            html: 
                `<div style="text-align: left; margin-bottom: 10px;">
                    <label style="display: block; font-weight: bold;">Tuổi</label>
                    <input id="swal-input1" class="swal2-input" placeholder="Tuổi" style="width: 80%;">
                </div>` +
                `<div style="text-align: left; margin-bottom: 10px;">
                    <label style="display: block; font-weight: bold;">Name</label>
                    <input id="swal-input2" class="swal2-input" placeholder="Name" style="width: 80%;">
                </div>` +
                `<div style="text-align: left; margin-bottom: 10px;">
                    <label style="display: block; font-weight: bold;">Email</label>
                    <input id="swal-input3" class="swal2-input" placeholder="Email" style="width: 80%;">
                </div>`
            ,
            showCancelButton: true,
            confirmButtonText: 'Lưu',
            cancelButtonText: 'Hủy',
            preConfirm: () => {
                const age = parseInt(Swal.getPopup().querySelector('swal-input1').value);
                const displayName = Swal.getPopup().querySelector('swal-input2').value;
                const email = Swal.getPopup().querySelector('swal-input3').value;
                return { age, displayName, email };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updatedData = result.value;
                try {
                    // Cập nhật state
                    setUsers(users.map((prod) => (prod.id === item.id ? { ...prod, ...updatedData } : prod)));
                    await updateDoc(doc(db, "users", item.id), { ...updatedData });
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
            text: `Xác nhận xóa ${item.email}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'OK',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setUsers(users.filter(i => i.id !== item.id));
                    await deleteDoc(doc(db, "users", item.id));
                    Swal.fire('Thành công!', 'Xóa thành công', 'success');
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
                <h1 style={styles.text}>Quản lý người dùng</h1>
                <button style={styles.addButton} onClick={() => handleAdd()}><PackagePlus size={16} />Thêm người dùng mới</button>
            </div>

            {users.length === 0 ? (
                <h1>Không tìm thấy người dùng nào</h1>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableRow}>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Tuổi</th>
                            <th>Tên</th>
                            <th>Xử lý dữ liệu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(item => (
                            <tr key={item.id} style={styles.tableRow}>
                                <td style={styles.text}>{item.email}</td>
                                <td style={styles.text}>{item.password}</td>
                                <td style={styles.text}>{item.age || null}</td>
                                <td style={styles.text}>{item.name}</td>
                                <td style={styles.actions}>
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

export default User;

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
    table: {
        width: '100%',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 150px)',
    },
    tableRow: {
        minHeight: '50px',
        textAlign: 'center',
        borderBottom: '1px solid #ccc',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000',
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
};