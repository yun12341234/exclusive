<template>
  <div class="about container-fluid text-light py-5" style="background-color: #010922;">
    
    <div class="row justify-content-center mb-5">
      <div class="col-md-8 text-center">
        <h1>ABOUT EXCLUSIVE</h1>
        <p>An exclusive party app! Based on preference</p>
        <p>Through AI we match your music taste, people preference, and past history for your perfect party.</p>
        <p>Whether you want to book tonight or months ahead, we got you!</p>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-3 mb-3">
        <img src="https://i.postimg.cc/ZRDSxpxh/Web-Pro-Pic1.png" alt="Party Image01" class="img-fluid rounded" />
        <p class="description1">Through AI we match your music taste, people preference, and past history for your perfect party.</p>
      </div>
      <div class="col-md-3 mb-3">
        <img src="https://i.postimg.cc/QCWRgPMp/Web-Pro-Pic2.png" alt="Party Image02" class="img-fluid rounded" />
      </div>
      <div class="col-md-3 mb-3">
        <img src="https://i.postimg.cc/nz5Lc657/Web-Pro-Pic3.png" alt="Party Image03" class="img-fluid rounded" />
        <p class="description2">Whether you want to book tonight or months ahead, we got you!</p>
      </div>
    </div>
    <div class="row mt-5 text-center">
      <div class="col-12">
        <h4>Featured on</h4>
        <div class="featured-bar d-flex justify-content-around align-items-center mt-3" style="background-color: #7AE0E6; width: 1175px; height: 90px; margin: auto;">
          <img src="https://i.postimg.cc/XJHLCCnw/image-6.png" alt="TechCrunch" class="featured-logo" style="width: 150px; height: auto;" />
          <img src="https://i.postimg.cc/hjPMvrRD/image-5.png" alt="FastCompany" class="featured-logo" style="width: 150px; height: auto;" />
          <img src="https://i.postimg.cc/MHnDbpGg/image-7.png" alt="MIT" class="featured-logo" style="width: 70px; height: auto;" />
          <img src="https://i.postimg.cc/MHYW5qrb/1684047548forbes-logo-white.png" alt="Forbes" class="featured-logo" style="width: 120px; height: auto;" />
        </div>
        <div class="featured-bar d-flex justify-content-center align-items-center mt-3" style="background-color:#FCE663; width: 1175px; height: 150px; margin: auto;">
          <div class="text-center">
            <h1>CHECK OUT YOUR EVENTS!</h1>
            <div class="btn-group mt-4">
              <router-link to="/events" class="btn btn-lg" style="background-color: #7AE0E6;">CLICK HERE</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about {
  text-align: center;
}

.about-header {
  background-color: #010922;
}

.about-header h1 {
  margin: 0;
  padding: 20px 0;
  font-size: 2.5rem;
  color: #fff;
}

h1, p {
  color: #fff;
}

.img-fluid {
  max-width: 100%;
  height: auto;
}

.featured-bar {
  padding: 10px;
  border-radius: 5px;
}

.featured-logo {
  max-width: 100%;
  margin: 0 10px;
}

.text-center h1 {
  color: #f2f4f9;
}
</style>
