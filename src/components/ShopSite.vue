<script setup>
import Book from './Book.vue'
</script>

<template>
  <h1>Hallo {{ email }}</h1>
    <div class="books">
        <p v-if="loading == true">Lade Bücher...</p>
        <Book v-for="book in books" :key="book.ProduktID" :book="book" class="Book" v-on:click="getDetails(book.ProduktID)"/>
    </div>
  
</template>
<script>
import Book from './Book.vue'; // Import the Book component
function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function IsLoggedIn(){
  let email = getCookie("email");
  if(email != ""){
  }else{
    alert("Sorry, but you are not logged in, please login first");
    document.location.href="/";
  }
}
function getEmail(){
  return getCookie("email");
}
function getDetails(produktID){
  console.log("Hallo" + produktID);
  document.location.href=`/books/${produktID}`;
}

export default {
  components: { Book },
  data() {
    return {
      books: [],
      loading: true,
      error: null,
      email: getEmail(),
    };
  },
  async created() {
    try {
      IsLoggedIn();
      const response = await fetch('http://localhost:3000/books'); // Replace with your backend URL
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      this.books = await response.json();
      console.log(this.books);
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  },
};
</script>
<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
  text-align: center;
  margin-top: 10vh;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}
.books{
    display: flex;
    flex-direction: row;
    gap:20px;
    width: 60vw;
    place-content: center;
    margin-left: 20vw;
}
.books .Book{
    width:300px;
    height:500px;
    text-align: center;
    padding:20px;

}
.Book:hover{
  cursor: pointer;
  box-shadow: 10px 10px;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
