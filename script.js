// Flower Products Database
let products = [
    { 
        id: 1, 
        name: "Pink Harmony Баглаа", 
        category: "bouquet", 
        price: 120000, 
        image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80", 
        rating: 4.9 
    },
    { 
        id: 2, 
        name: "Royal Red Сарнай", 
        category: "roses", 
        price: 180000, 
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80", 
        rating: 5.0 
    },
    { 
        id: 3, 
        name: "Orchid Савтай Цэцэг", 
        category: "potted", 
        price: 95000, 
        image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80", 
        rating: 4.7 
    },
    { 
        id: 4, 
        name: "Luxury Flower & Gift Box", 
        category: "gifts", 
        price: 220000, 
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80", 
        rating: 4.9 
    }
];

// Orders database
let orders = [
    { id: 101, customer: "Билгүүн", address: "СБД, 1-р хороо", date: "2026-06-10 14:00", payment: "QPay", status: "Хүргэлтэнд гарсан" },
    { id: 102, customer: "Тэмүүлэн", address: "ХУД, Зайсан", date: "2026-06-10 16:30", payment: "Card", status: "Баталгаажсан" }
];

// Return requests database
let returnRequests = [
    { id: 1, customer: "Тэмүүлэн", item: "Royal Red Сарнай", reason: "Дэлбээ нь үйрсэн байсан", status: "Хүлээгдэж буй" }
];

let cart = [];
let currentCategory = 'all';
let currentUser = null; 

let registeredUsers = [
    { name: "Админ Дэлгүүр", email: "admin@nkhflower.mn", password: "123", role: "admin" },
    { name: "Менежер Сараа", email: "manager@nkhflower.mn", password: "123", role: "manager" },
    { name: "Харилцагч Билгүүн", email: "user@nkhflower.mn", password: "123", role: "customer" }
];

let tempRegData = null;
let generatedCode = "";
let forgotEmailTarget = "";
let forgotCode = "";

// Format Currency
function formatMNT(amount) {
    return amount.toLocaleString() + ' ₮';
}

// Render Products
function renderProducts(filter = 'all', search = '') {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    const filtered = products.filter(p => {
        const matchesCategory = filter === 'all' || p.category === filter;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400">Цэцэг олдсонгүй</div>`;
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = "product-card bg-white rounded-2xl p-4 border border-pink-100 flex flex-col justify-between shadow-sm";
        card.innerHTML = `
            <div class="bg-pink-50 rounded-xl h-52 flex items-center justify-center relative mb-4 overflow-hidden group">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105">
                <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                    <i class="fa-solid fa-star text-amber-400 mr-1"></i>${product.rating}
                </span>
            </div>
            <div>
                <h3 class="font-bold text-slate-900 text-lg mb-1">${product.name}</h3>
                <p class="text-pink-600 font-bold text-base mb-4">${formatMNT(product.price)}</p>
            </div>
            <div class="flex gap-2">
                <button onclick="addToCart(${product.id})" class="flex-1 bg-slate-900 hover:bg-pink-600 text-white font-medium py-2.5 rounded-xl transition text-sm shadow-md">
                    Сагсанд
                </button>
                ${currentUser && currentUser.role === 'admin' ? `
                    <button onclick="deleteProduct(${product.id})" class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2.5 rounded-xl transition text-xs" title="Устгах">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

// Add Product (Admin)
function addNewProduct(event) {
    event.preventDefault();
    const name = document.getElementById('newProdName').value;
    const category = document.getElementById('newProdCat').value;
    const price = Number(document.getElementById('newProdPrice').value);
    const image = document.getElementById('newProdImg').value;

    products.push({ id: products.length + 1, name, category, price, image, rating: 5.0 });
    renderProducts(currentCategory);
    alert("Шинэ цэцэг нэмэгдлээ!");
    event.target.reset();
}

// Delete Product (Admin)
function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    renderProducts(currentCategory);
    alert("Бүтээгдэхүүн устгагдлаа.");
}

// Filter Category
function filterCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.className = "cat-btn px-5 py-2 rounded-full text-sm font-semibold bg-white text-slate-600 hover:bg-pink-50 border border-pink-100 transition";
    });
    event.target.className = "cat-btn px-5 py-2 rounded-full text-sm font-semibold bg-pink-600 text-white transition shadow-sm";

    renderProducts(category, document.getElementById('searchInput').value);
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    renderProducts(currentCategory, e.target.value);
});

// Modals
function toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    drawer.classList.toggle('translate-x-full');
    overlay.classList.toggle('hidden');
}

function toggleLoginModal() {
    document.getElementById('loginModal').classList.toggle('hidden');
    document.getElementById('loginOverlay').classList.toggle('hidden');
}

function toggleRegisterModal() {
    document.getElementById('registerModal').classList.toggle('hidden');
    document.getElementById('registerOverlay').classList.toggle('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('verifySection').classList.add('hidden');
}

function toggleForgotPasswordModal() {
    toggleLoginModal();
    document.getElementById('forgotModal').classList.toggle('hidden');
    document.getElementById('forgotOverlay').classList.toggle('hidden');
}

function toggleReturnModal() {
    if (!currentUser) {
        alert("Та буцаалтын хүсэлт илгээхийн тулд нэвтэрнэ үү!");
        toggleLoginModal();
        return;
    }
    document.getElementById('returnModal').classList.toggle('hidden');
    document.getElementById('returnOverlay').classList.toggle('hidden');
}

// Submit Return Request by Customer
function submitReturnRequest(event) {
    event.preventDefault();
    const itemName = document.getElementById('returnItemName').value;
    const reason = document.getElementById('returnReason').value;

    returnRequests.unshift({
        id: returnRequests.length + 1,
        customer: currentUser.name,
        item: itemName,
        reason: reason,
        status: "Хүлээгдэж буй"
    });

    alert("Таны буцаалтын хүсэлт амжилттай илгээгдлээ. Админ шалгаад шийдвэрлэх болно.");
    toggleReturnModal();
    event.target.reset();
    if (currentUser.role === 'admin' || currentUser.role === 'manager') {
        renderAdminReturnTable();
    }
}

// Register & Login flows
function requestRegisterCode(event) {
    event.preventDefault();
    const role = document.getElementById('regRole').value;
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    if (registeredUsers.some(u => u.email === email)) {
        alert("И-мэйл бүртгэлтэй байна!");
        return;
    }

    tempRegData = { role, name, email, password };
    generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
    alert(`[Баталгаажуулах код]\nКод: ${generatedCode}`);

    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('verifySection').classList.remove('hidden');
}

function confirmRegistration() {
    if (document.getElementById('verifyCodeInput').value !== generatedCode) {
        alert("Код буруу!");
        return;
    }
    registeredUsers.push(tempRegData);
    alert("Бүртгэл амжилттай!");
    toggleRegisterModal();
    toggleLoginModal();
    document.getElementById('loginEmail').value = tempRegData.email;
}

function requestForgotCode(event) {
    event.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    if (!registeredUsers.some(u => u.email === email)) {
        alert("И-мэйл олдсонгүй!");
        return;
    }
    forgotEmailTarget = email;
    forgotCode = Math.floor(1000 + Math.random() * 9000).toString();
    alert(`[Сэргээх код]\nКод: ${forgotCode}`);
    document.getElementById('forgotForm').classList.add('hidden');
    document.getElementById('forgotResetSection').classList.remove('hidden');
}

function confirmPasswordReset() {
    if (document.getElementById('forgotCodeInput').value !== forgotCode) {
        alert("Код буруу!");
        return;
    }
    const user = registeredUsers.find(u => u.email === forgotEmailTarget);
    user.password = document.getElementById('newPasswordInput').value;
    alert("Нууц үг шинэчлэгдлээ!");
    document.getElementById('forgotModal').classList.add('hidden');
    document.getElementById('forgotOverlay').classList.add('hidden');
    toggleLoginModal();
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
    if (!foundUser) {
        alert("И-мэйл эсвэл нууц үг буруу!");
        return;
    }

    currentUser = foundUser;
    toggleLoginModal();
    updateUserUI();
    renderProducts(currentCategory);
    alert(`Тавтай морил, ${currentUser.name}!`);
}

function logout() {
    currentUser = null;
    updateUserUI();
    renderProducts(currentCategory);
    alert("Системээс гарлаа.");
}

// Update UI & Permissions
function updateUserUI() {
    const authButtons = document.getElementById('authButtons');
    const userProfileArea = document.getElementById('userProfileArea');
    const userRoleBadge = document.getElementById('userRoleBadge');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const dashboardPanel = document.getElementById('dashboardPanel');
    const dashboardTitle = document.getElementById('dashboardTitle');
    const activeRoleText = document.getElementById('activeRoleText');
    const adminActionSection = document.getElementById('adminActionSection');

    if (!currentUser) {
        authButtons.classList.remove('hidden');
        userProfileArea.classList.add('hidden');
        dashboardPanel.classList.add('hidden');
        return;
    }

    authButtons.classList.add('hidden');
    userProfileArea.classList.remove('hidden');
    userProfileArea.classList.add('flex');

    userNameDisplay.textContent = currentUser.name;
    activeRoleText.textContent = currentUser.role.toUpperCase();

    // Customers do not see any admin dashboard panel
    if (currentUser.role === 'customer') {
        dashboardPanel.classList.add('hidden');
    } else {
        dashboardPanel.classList.remove('hidden');
        if (currentUser.role === 'admin') {
            userRoleBadge.className = "text-xs font-bold px-2.5 py-1 rounded-full bg-red-600 text-white";
            dashboardTitle.textContent = "Админ бүрэн удирдлагын самбар";
            adminActionSection.classList.remove('hidden');
        } else {
            userRoleBadge.className = "text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500 text-white";
            dashboardTitle.textContent = "Менежерийн удирдлагын самбар";
            adminActionSection.classList.add('hidden');
        }
        renderAdminOrderTable();
        renderAdminReturnTable();
    }
}

// Render Admin/Manager Orders Table
function renderAdminOrderTable() {
    const tbody = document.getElementById('adminOrderTableBody');
    tbody.innerHTML = '';

    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="p-3 font-semibold text-slate-800">${order.customer}</td>
            <td class="p-3">${order.address}<br><span class="text-[10px] text-slate-400">${order.date}</span></td>
            <td class="p-3 font-medium text-pink-600">${order.payment}</td>
            <td class="p-3">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    order.status === 'Хүргэгдсэн' ? 'bg-emerald-100 text-emerald-700' : 
                    order.status === 'Хүргэлтэнд гарсан' ? 'bg-amber-100 text-amber-700' : 'bg-pink-100 text-pink-700'
                }">${order.status}</span>
            </td>
            <td class="p-3">
                <select onchange="updateOrderStatus(${order.id}, this.value)" class="bg-pink-50 border border-pink-200 rounded px-2 py-1 text-xs">
                    <option value="Баталгаажсан" ${order.status === 'Баталгаажсан' ? 'selected' : ''}>Баталгаажсан</option>
                    <option value="Хүргэлтэнд гарсан" ${order.status === 'Хүргэлтэнд гарсан' ? 'selected' : ''}>Хүргэлтэнд гарсан</option>
                    <option value="Хүргэгдсэн" ${order.status === 'Хүргэгдсэн' ? 'selected' : ''}>Хүргэгдсэн</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        alert(`Захиалгын төлөв "${newStatus}" болж шинэчлэгдлээ.`);
    }
}

// Render Admin/Manager Return Requests Table
function renderAdminReturnTable() {
    const tbody = document.getElementById('adminReturnTableBody');
    tbody.innerHTML = '';

    if (returnRequests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-slate-400">Буцаалтын хүсэлт байхгүй байна</td></tr>`;
        return;
    }

    returnRequests.forEach(req => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="p-3 font-semibold text-slate-800">${req.customer}</td>
            <td class="p-3"><strong class="text-pink-600">${req.item}</strong><br><span class="text-[11px] text-slate-500">${req.reason}</span></td>
            <td class="p-3">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    req.status === 'Зөвшөөрсөн' ? 'bg-emerald-100 text-emerald-700' : 
                    req.status === 'Татгалзсан' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }">${req.status}</span>
            </td>
            <td class="p-3 flex gap-2">
                <button onclick="updateReturnStatus(${req.id}, 'Зөвшөөрсөн')" class="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs">Зөвшөөрөх</button>
                <button onclick="updateReturnStatus(${req.id}, 'Татгалзсан')" class="bg-red-500 hover:bg-red-400 text-white px-3 py-1.5 rounded-lg text-xs">Татгалзах</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateReturnStatus(reqId, status) {
    const req = returnRequests.find(r => r.id === reqId);
    if (req) {
        req.status = status;
        renderAdminReturnTable();
        alert(`Буцаалтын хүсэлт "${status}" төлөвт шилжлээ.`);
    }
}

// Cart & Checkout
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    toggleCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="text-center text-slate-400 py-12">Таны сагс хоосон байна</div>`;
        cartTotal.textContent = formatMNT(0);
        return;
    }

    cartItemsContainer.innerHTML = '';
    let totalSum = 0;

    cart.forEach(item => {
        totalSum += item.price * item.quantity;
        const itemDiv = document.createElement('div');
        itemDiv.className = "flex items-center justify-between bg-pink-50/50 p-3 rounded-xl border border-pink-100";
        itemDiv.innerHTML = `
            <div class="flex items-center space-x-3">
                <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg">
                <div>
                    <h4 class="font-semibold text-sm text-slate-900">${item.name}</h4>
                    <p class="text-xs text-slate-500">${formatMNT(item.price)} x ${item.quantity}</p>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-slate-400 hover:text-red-500 p-2 transition">
                <i class="fa-solid fa-trash-can text-sm"></i>
            </button>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    cartTotal.textContent = formatMNT(totalSum);
}

function checkout() {
    if (!currentUser) {
        alert("Та захиалга өгөхийн тулд эхлээд системд нэвтэрнэ үү!");
        toggleLoginModal();
        return;
    }
    if (cart.length === 0) {
        alert("Таны сагс хоосон байна!");
        return;
    }

    const address = document.getElementById('deliveryAddress').value;
    const date = document.getElementById('deliveryDate').value;
    const time = document.getElementById('deliveryTime').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    if (!address || !date || !time) {
        alert("Хүргэлтийн хаяг, огноо, цагийг бүрэн бөглөнө үү!");
        return;
    }

    orders.unshift({
        id: orders.length + 101,
        customer: currentUser.name,
        address: address,
        date: `${date} ${time}`,
        payment: paymentMethod,
        status: "Баталгаажсан"
    });

    alert(`Баярлалаа ${currentUser.name}!\nТөлбөрийн хэлбэр: ${paymentMethod}\nТаны захиалга амжилттай баталгаажлаа!`);
    
    cart = [];
    updateCartUI();
    toggleCart();
    if (currentUser.role === 'admin' || currentUser.role === 'manager') {
        renderAdminOrderTable();
    }
}

// Initial Load
renderProducts();