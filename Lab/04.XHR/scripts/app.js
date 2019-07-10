function loadRepos() {
   const xhr = new XMLHttpRequest();

   const statusChecker = {
      isSuccess: (status) => status === 200
   }

   const handleResponse = function () {
      if (this.readyState < 4) {
         return;
      }

      if (!statusChecker.isSuccess(this.status)) {
         return;
      }

      const res = document.getElementById('res');
      res.textContent = this.responseText;
   };

   xhr.onreadystatechange = handleResponse;
   xhr.open('GET', 'https://api.github.com/users/testnakov/repos', true);
   xhr.send();
}