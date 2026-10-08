document.addEventListener('DOMContentLoaded', () => {
  // mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // product filtering on products.html
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productItems = document.querySelectorAll('.product-item');

  if (filterButtons.length && productItems.length) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;

        productItems.forEach((item) => {
          const category = item.dataset.category;
          const shouldShow = filter === 'all' || category === filter;
          item.style.display = shouldShow ? 'block' : 'none';
        });
      });
    });
  }

  // order form logic
  const orderForm = document.getElementById('orderForm');
  const orderMessage = document.getElementById('orderMessage');
  const summaryList = document.getElementById('summaryList');

  if (orderForm) {
    const addRowBtn = document.querySelector('.btn-add-item');
    const orderItems = document.getElementById('orderItems');

    const addOrderRow = () => {
      const row = document.createElement('div');
      row.className = 'order-row';
      row.innerHTML = `
        <select class="product-select" required>
          <option value="">-- Choose Product --</option>
          <option value="Tomato Ketchup">Tomato Ketchup</option>
          <option value="Chilli Garlic Sauce">Chilli Garlic Sauce</option>
          <option value="BBQ Sauce">BBQ Sauce</option>
          <option value="Green Chilli Sauce">Green Chilli Sauce</option>
          <option value="Pizza Sauce">Pizza Sauce</option>
          <option value="Soya Sauce">Soya Sauce</option>
          <option value="Hot & Sweet Sauce">Hot & Sweet Sauce</option>
          <option value="Top Creamy Mayo">Top Creamy Mayo</option>
          <option value="Too Good Mayonnaise">Too Good Mayonnaise</option>
          <option value="Original Creamy Mayo">Original Creamy Mayo</option>
          <option value="White Vinegar">White Vinegar</option>
        </select>
        <select class="size-select">
          <option>500ml</option>
          <option>1 Liter</option>
          <option selected>1 Gallon</option>
          <option>1 KG</option>
          <option>2 KG</option>
        </select>
        <input type="number" class="qty-input" min="1" max="999" value="1" />
        <button type="button" class="btn-remove">×</button>
      `;

      const removeBtn = row.querySelector('.btn-remove');
      removeBtn.addEventListener('click', () => {
        row.remove();
        updateSummary();
      });

      row.querySelectorAll('select, input').forEach((input) => {
        input.addEventListener('input', updateSummary);
        input.addEventListener('change', updateSummary);
      });

      orderItems.appendChild(row);
      updateSummary();
    };

    const updateSummary = () => {
      if (!summaryList) return;

      const rows = document.querySelectorAll('.order-row');
      const items = [];

      rows.forEach((row) => {
        const product = row.querySelector('.product-select')?.value;
        const size = row.querySelector('.size-select')?.value;
        const qty = Number(row.querySelector('.qty-input')?.value || 0);

        if (product && qty > 0) {
          items.push(`<li>${qty} x ${product} (${size})</li>`);
        }
      });

      summaryList.innerHTML = items.length ? items.join('') : '<li>No items selected</li>';
    };

    if (addRowBtn) {
      addRowBtn.addEventListener('click', addOrderRow);
    }

    document.querySelectorAll('.btn-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.closest('.order-row')?.remove();
        updateSummary();
      });
    });

    document.querySelectorAll('.product-select, .size-select, .qty-input').forEach((el) => {
      el.addEventListener('input', updateSummary);
      el.addEventListener('change', updateSummary);
    });

    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('oname')?.value.trim();
      const phone = document.getElementById('ophone')?.value.trim();
      const city = document.getElementById('ocity')?.value.trim();
      const address = document.getElementById('oaddress')?.value.trim();
      const notes = document.getElementById('onotes')?.value.trim();
      const payment = document.getElementById('opayment')?.value || 'Cash on Delivery';

      const rows = document.querySelectorAll('.order-row');
      const validItems = [];

      rows.forEach((row) => {
        const product = row.querySelector('.product-select')?.value;
        const size = row.querySelector('.size-select')?.value;
        const qty = Number(row.querySelector('.qty-input')?.value || 0);

        if (product && qty > 0) {
          validItems.push({ product, size, qty });
        }
      });

      if (!name || !phone || !city || !address || validItems.length === 0) {
        if (orderMessage) {
          orderMessage.textContent = 'Please complete all required fields and choose at least one product.';
          orderMessage.style.color = '#e74c3c';
          orderMessage.style.background = '#fff4f4';
        }
        return;
      }

      let message = 'Hello Dip N Taste,%0A%0A';
      message += `Name: ${encodeURIComponent(name)}%0A`;
      message += `Phone: ${encodeURIComponent(phone)}%0A`;
      message += `City: ${encodeURIComponent(city)}%0A`;
      message += `Address: ${encodeURIComponent(address)}%0A`;
      message += `Payment Method: ${encodeURIComponent(payment)}%0A`;
      if (notes) message += `Notes: ${encodeURIComponent(notes)}%0A`;
      message += '%0AProducts:%0A';

      validItems.forEach((item) => {
        message += `- ${encodeURIComponent(item.qty)} x ${encodeURIComponent(item.product)} (${encodeURIComponent(item.size)})%0A`;
      });

      window.open(`https://wa.me/923111177744?text=${message}`, '_blank');

      if (orderMessage) {
        orderMessage.textContent = 'Your order is ready to send on WhatsApp.';
        orderMessage.style.color = '#27ae60';
        orderMessage.style.background = '#f0fff5';
      }
    });
  }

  // contact form logic
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();
      const subject = document.getElementById('subject')?.value || 'Product Inquiry';
      const message = document.getElementById('message')?.value.trim();

      if (!name || !message) {
        formMessage.textContent = 'Please fill in your name and message.';
        formMessage.style.color = '#e74c3c';
        formMessage.style.background = '#fff4f4';
        return;
      }

      const encodedMessage = encodeURIComponent(
        `Hello Dip N Taste,%0A%0A` +
        `Name: ${name}%0A` +
        `Phone: ${phone}%0A` +
        `Email: ${email}%0A` +
        `Subject: ${subject}%0A%0A` +
        `Message:%0A${message}`
      );

      window.open(`https://wa.me/923111177744?text=${encodedMessage}`, '_blank');

      formMessage.textContent = 'Your message is ready to send on WhatsApp.';
      formMessage.style.color = '#27ae60';
      formMessage.style.background = '#f0fff5';
    });
  }
});
