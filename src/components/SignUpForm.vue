<template>
  <div class="SignupForm">
    <form action="" method="GET">
      <div class="row flex">
        <label for="Vorname">Vorname:</label>
        <input type="text" name="Vorname" id="Vorname" placeholder="Max" min="2" required />
        <label for="Nachname">Nachname:</label>
        <input
          type="text"
          name="Nachname"
          id="Nachname"
          placeholder="Mustermann"
          min="2"
          required
        />
      </div>
      <br />
      <div class="row flex">
        <label for="Email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="max.mustermann@gmail.com"
          required
        />
      </div>
      <br />
      <div class="row">
        <label for="Straße">Straße:</label>
        <input type="text" name="Straße" id="Straße" max="50" placeholder="Musterstraße" />
        <label for="Ort">Ort:</label>
        <input type="text" name="Ort" id="Ort" placeholder="Musterstadt" Max="50" />
        <label for="PLZ">PLZ:</label>
        <input type="number" name="PLZ" id="PLZ" min="01067" max="99998" />
      </div>
      <br />
      <div class="row">
        <label for="URL">URL:</label>
        <input
          type="url"
          name="URL"
          id="URL"
          placeholder="https://www.w3schools.com/howto/howto_css_login_form.asp"
        />
      </div>
      <br />
      <div class="row">
        <label for="Alter">Alter:</label>
        <input type="number" name="Alter" id="Alter" min="3" max="120" />
      </div>
      <br />
      <div class="row">
        <label for="Interesse">Interesse an ähnlichen Produkten</label>
        <input type="range" name="Interesse" id="Interesse" min="0" max="10" value="5" />
      </div>
      <br />
      <div class="row">
        <label for="textfeld">Textfeld</label><br />
        <textarea
          name="textfeld"
          id="textfeld"
          rows="5"
          spellcheck="true"
          placeholder="Bitte geben Sie hier Ihre Anfrage an uns ein!"
        ></textarea>
      </div>
      <div class="row">
        <input type="submit" value="Anfrage absenden" />
      </div>
      <p>Du hast noch keinen Account? <a href="/login">Melde dich hier an!</a></p>
    </form>
  </div>
</template>

<style>
body {
  width: 400px;
  margin: 0 40vw;
  background-color: rgb(0, 225, 255);
}
form {
  background-color: white;
  padding: 50px;
  width: 400px;
}
a:hover {
  cursor: pointer;
}
.SignupForm{
  margin-left: 40vw;
  margin-top: 5vh;
}
</style>
