<template>
  <div class="LoginForm">
    <h1>Login Window</h1>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="email" class="form-label">E-Mail Adresse</label><br />
        <input
          type="email"
          class="form-control"
          id="email"
          name="email"
          v-model="email"
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Passwort</label><br />
        <input
          type="password"
          class="form-control"
          id="password"
          name="password"
          v-model="password"
        />
      </div>
      <div class="mb-3 submit-row">
        <input
          type="submit"
          class="btn btn-success"
          id="submit"
          value="Einloggen"
        />
      </div>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '', // Bind this to the email input field
      password: '', // Bind this to the password input field
      message: '', // Display login messages
    };
  },
  methods: {
    async handleLogin() {
      try {
        // Send login credentials to the backend
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email, // Use the bound email
            password: this.password, // Use the bound password
          }),
        });

        const data = await response.json();

        if (response.ok) {
          this.message = data.message; // Show success message
          document.cookie = `email=${this.email}`
          this.$router.push('/shop'); // Redirect to the next page (ensure Vue Router is configured)
        } else {
          this.message = data.message; // Show error message
        }
      } catch (error) {
        this.message = 'An error occurred while logging in.';
        console.error('Login error:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>

<style>
body {
  width: 200px;
}
.LoginForm{
  margin-left: 40vw;
  margin-top: 20vh;
}
h1 {
  font-size: 28px;
  padding-bottom: 20px;
}
input {
  padding: 5px;
}
.submit-row {
  text-align: center;
}
#submit {
  margin-top: 20px;
  border: none;
  border-radius: 20%;
  background-color: rgb(73, 247, 67);
  font-size: 15px;
}
#submit:hover {
  background-color: rgb(54, 228, 54);
  color: white;
  cursor: pointer;
}
</style>
