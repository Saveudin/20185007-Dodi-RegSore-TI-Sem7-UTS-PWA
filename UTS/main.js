if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}

//Inisialisasi indexedDB
const request = indexedDB.open("dbkomentar", 1);
    let db;
    
    request.onerror = (event) => {console.log("Gagal membuka database:", event.target.error);};
    
    request.onsuccess = function(event) {
        db = event.target.result;
        tampilkankomentar();
    };
    
    request.onupgradeneeded = function(event) {
        db = event.target.result;
        const objectStore = db.createObjectStore("komentar", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("isikomentar", "isikomentar", { unique: false });
    };

    //menambah data
const commentForm = document.getElementById('commentForm');
commentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const comment = document.getElementById("comment").value;

    const transaction = db.transaction(["komentar"], "readwrite");
    const objectStore = transaction.objectStore("komentar");
    const komentar = { comment };

    objectStore.add(komentar);

    transaction.oncomplete = function() {
        document.getElementById("comment").value = "";
    };

    transaction.onerror = function(event) {
        console.log("Gagal menyimpan data:", event.target.error);
    };
});
    // function tampilkankomentar() {
    //     const komenlist = document.getElementById("komenlist");
    //     komenlist.innerHTML = "";
    
    //     const transaction = db.transaction(["komentar"], "readonly");
    //     const objectStore = transaction.objectStore("komentar");
    
    //     const request = objectStore.openCursor();
    
    //     request.onsuccess = function(event) {
    //         const cursor = event.target.result;
    //         if (cursor) {
    //             const li = document.createElement("li");
    //             li.textContent = `isikomentar: ${cursor.value.isikomentar}`;
    //             komenlist.appendChild(li);
    //             cursor.continue();
    //         }
    //     };
    
    //     transaction.onerror = function(event) {
    //         console.log("Gagal membaca data:", event.target.error);
    //     };
    // }

//Notifikasi
    Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
            alert('Notifikasi diijinkan');
            navigator.serviceWorker.ready.then(function (registration) {
                registration.showNotification('PWA Push', {
                    body: 'Halooooo !',
                    icon: 'icon/icon-192x192.png'
                });
            });
        }
        else if(permission === 'denied'){
            alert('notifikasi mati');
        }
    });