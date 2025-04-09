const form = document.getElementById('checkoutForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  let isValid = true;
  successMessage.textContent = "";

  document.querySelectorAll('.error').forEach(e => e.textContent = "");

  const fullName = form.fullName;
  const email = form.email;
  const phone = form.phone;
  const address = form.address;
  const ccnum = form.ccnum;
  const expiry = form.expiry;
  const cvv = form.cvv;

  if (!/^[A-Za-z\s]+$/.test(fullName.value)) {
    document.getElementById('fullNameError').textContent = "Full Name must contain only alphabets.";
    isValid = false;
  }

  if (!email.checkValidity()) {
    document.getElementById('emailError').textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (!/^\d{10,15}$/.test(phone.value)) {
    document.getElementById('phoneError').textContent = "Phone Number must be 10 to 15 digits.";
    isValid = false;
  }

  if (address.value.trim() === "") {
    document.getElementById('addressError').textContent = "Address is required.";
    isValid = false;
  }

  if (!/^\d{16}$/.test(ccnum.value)) {
    document.getElementById('ccnumError').textContent = "Credit Card must be exactly 16 digits.";
    isValid = false;
  }

  const currentDate = new Date();
  const [year, month] = expiry.value.split("-");
  const expiryDate = new Date(year, month);
  if (!expiry.value || expiryDate <= currentDate) {
    document.getElementById('expiryError').textContent = "Expiry date must be in the future.";
    isValid = false;
  }

  if (!/^\d{3}$/.test(cvv.value)) {
    document.getElementById('cvvError').textContent = "CVV must be exactly 3 digits.";
    isValid = false;
  }

  if (isValid) {
    successMessage.textContent = "Form submitted successfully!";
    form.reset();
  }
});
