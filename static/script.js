// SCROLL ANIMATION
window.addEventListener("scroll", () => {
    document.querySelectorAll("section").forEach(sec => {
        if(sec.getBoundingClientRect().top < window.innerHeight - 100){
            sec.classList.add("active");
        }
    });
});

// MODAL FUNCTIONS
function openModal() {
    document.getElementById('contactModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('contactModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    var modal = document.getElementById('contactModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}