async function login() {
  const formEl = document.forms.loginForm;
  const formData = new FormData(formEl);
  const message = (await axios({
    method: 'post',
    url: 'auth/login',
    headers: {},
    data: {
      username: formData.get("username"),
      password: formData.get("password")
    }
  })).data;
  const messageLogin = document.getElementById("messageLogin");
  if (message.success === 0) {
    messageLogin.innerHTML = messageError(message.message);
  } else {
    // const loginModel = document.getElementById("loginModal");
    // $('#loginModal').modal('hide');
    location.reload();
  }
}

async function signup() {
  const formEl = document.forms.signupForm;
  const formData = new FormData(formEl);
  const messageSignup = document.getElementById("messageSignup");
  if (formData.get("password") !== formData.get("confirmation")) {
    messageSignup.innerHTML = messageError("Passwords not match!");
    return;
  }
  const message = (await axios({
    method: 'post',
    url: 'auth/signup',
    headers: {},
    data: {
      username: formData.get("username"),
      password: formData.get("password"),
      confirmation: formData.get("confirmation"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email")
    }
  })).data;
  
  if (message.success === 0) {
    messageLogin.innerHTML = messageError(message.message);
  } else {
    location.reload();
  }
}

function messageError(message) {
return `<div class="alert alert-warning alert-dismissible fade show text-center" id="signin-failed" role="alert">
    <strong>${message}</strong>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
`;
}