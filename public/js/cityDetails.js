window.addEventListener('load', async (event) => {
  const forcastData = (await window.axios.get(`${window.location.pathname}/7days`)).data;
  console.log(forcastData);
});