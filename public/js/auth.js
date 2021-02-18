async function login() {
  const formEl = document.forms.loginForm;
  const formData = new FormData(formEl);
  console.log(formData.get("username"));
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

function messageError(message) {
return `<div class="alert alert-warning alert-dismissible fade show text-center" id="signin-failed" role="alert">
    <strong>${message}</strong>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
`;
}