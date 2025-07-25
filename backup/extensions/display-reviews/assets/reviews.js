document.addEventListener("DOMContentLoaded", function() {
    const box = document.getElementById('my-review-box');
    if (!box) return;
    const productId = box.getAttribute('data-product-id');
    fetch(`http://localhost:8080/api/reviews?product_id=${productId}`)
        .then(res => res.json())
        .then(data => {
          box.innerHTML += data.reviews.map(
            r => `<div class="review"><b>${r.author}</b>: ${r.text}</div>`
          ).join('');
          // Optional: Render a form for new review submission
          box.innerHTML += `
            <form id="review-form">
              <input type="text" name="author" placeholder="Your name" required/>
              <textarea name="text" placeholder="Your review" required></textarea>
              <button type="submit">Submit</button>
            </form>
          `;
          document.getElementById('review-form').onsubmit = function(e) {
            e.preventDefault();
            // Implement POST logic to your app here
          }
        });
  });