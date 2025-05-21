// Header component
const header = Vue.createApp({
  template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html">
          <img src="assets/logo.jpg" alt="Logo" width="30" height="30">
          PawPal
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" :class="{ active: isActive('index.html') }" :aria-current="isActive('index.html') ? 'page' : null" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" :class="{ active: isActive('pets.html') }" :aria-current="isActive('pets.html') ? 'page' : null" href="pets.html">Adopt</a></li>
            <li class="nav-item"><a class="nav-link" :class="{ active: isActive('about.html') }" :aria-current="isActive('about.html') ? 'page' : null" href="about.html">About</a></li>
            <li class="nav-item"><a class="nav-link" :class="{ active: isActive('contact.html') }" :aria-current="isActive('contact.html') ? 'page' : null" href="contact.html">Contact</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  methods: {
    isActive(page) {
      return window.location.pathname.endsWith(page);
    }
  }
});
header.mount('#header-component');

// Footer component
const footer = Vue.createApp({
  template: `
    <div class="container text-center py-4">
      <p class="mb-1">&copy; {{ currentYear }} PawPal Animal Shelter. All rights reserved.</p>
      <div>
        <a href="#" class="me-3 text-decoration-none text-dark"><i class="bi bi-facebook"></i> Facebook</a>
        <a href="#" class="me-3 text-decoration-none text-dark"><i class="bi bi-instagram"></i> Instagram</a>
        <a href="#" class="text-decoration-none text-dark"><i class="bi bi-envelope"></i> Email Us</a>
      </div>
    </div>
  `,
  data() {
    return {
      currentYear: new Date().getFullYear()
    };
  }
});
footer.mount('#footer-component');

// Contentful client setup
const client = contentful.createClient({
  space: 'msh4gw1fey5r',             
  accessToken: 'zWETGrXjqOS2Z3eeZqS7CbsboT1tkkNzI5c3yc_b36A'    
});

// Vue app to render adoptable pets
const adoptableApp = Vue.createApp({
  data() {
    return {
      pets: []
    };
  },
  mounted() {
    client.getEntries({ content_type: 'pawPalShelter' })
  .then(response => {
    console.log('✅ Contentful Response:', response);

    this.pets = response.items.map(item => {
      const imageUrl = item.fields.image?.fields?.file?.url
        ? (item.fields.image.fields.file.url.startsWith('//') 
          ? 'https:' + item.fields.image.fields.file.url 
          : item.fields.image.fields.file.url)
        : 'https://via.placeholder.com/400x300?text=No+Image';

      return {
        name: item.fields.name,
        species: item.fields.species,
        breed: item.fields.breed,
        age: item.fields.age,
        description: item.fields.description,
        image: imageUrl
      };
    });
  })
  .catch(error => {
    console.error('❌ Error loading pets from Contentful:', error);
  });
  }
});
adoptableApp.mount('#adoptable-component');
