<script>
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('listItemForm');
    const submitBtn = document.getElementById('submitBtn');
    const imageInput = document.getElementById('images');
    const imagePreview = document.getElementById('imagePreview');
    const description = document.getElementById('description');
    const charCount = document.getElementById('charCount');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const progressBar = document.getElementById('progressBar');

    // Form fields and step names
    const fields = [
      { element: document.getElementById('itemName'), name: 'Item Name' },
      { element: document.getElementById('category'), name: 'Category' },
      { element: description, name: 'Description' },
      { element: document.getElementById('price'), name: 'Price' },
      { element: startDate, name: 'Start Date' },
      { element: endDate, name: 'End Date' },
      { element: document.getElementById('location'), name: 'Location' },
      { element: imageInput, name: 'Images' }
    ];

    // Update progress bar
    function updateProgress() {
      let validFields = 0;
      fields.forEach(field => {
        const { element } = field;
        if (element === imageInput) {
          if (element.files.length > 0) validFields++;
        } else if (element === description) {
          if (element.value.trim().length > 0) validFields++;
        } else if (element === document.getElementById('category')) {
          if (element.value && element.value !== 'Select Category') validFields++;
        } else {
          if (element.value && element.checkValidity()) validFields++;
        }
      });

      const progress = (validFields / fields.length) * 100;
      progressBar.style.width = `${progress}%`;
      progressBar.setAttribute('aria-valuenow', progress);

      if (validFields === fields.length) {
        progressBar.textContent = `Step ${validFields}/${fields.length}: ${fields[validFields - 1].name}`;
      } else if (validFields > 0) {
        progressBar.textContent = `Step ${validFields}/${fields.length}: ${fields[validFields - 1].name}`;
      } else {
        progressBar.textContent = `Step 0/${fields.length}`;
      }
    }

    // Add input listeners to all fields
    fields.forEach(field => {
      field.element.addEventListener('input', updateProgress);
      field.element.addEventListener('change', updateProgress);
    });

    // Bootstrap form validation
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      // Manually validate dates
      const today = new Date().toISOString().split('T')[0];
      if (startDate.value && startDate.value < today) {
        startDate.classList.add('is-invalid');
        startDate.nextElementSibling.textContent = 'Start date cannot be in the past.';
      } else if (startDate.value && endDate.value && endDate.value < startDate.value) {
        endDate.classList.add('is-invalid');
        endDate.nextElementSibling.textContent = 'End date must be after start date.';
      } else {
        startDate.classList.remove('is-invalid');
        endDate.classList.remove('is-invalid');
      }

      if (form.checkValidity() && !startDate.classList.contains('is-invalid') && !endDate.classList.contains('is-invalid')) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // Simulate API call
        setTimeout(() => {
          progressBar.style.width = '100%';
          progressBar.setAttribute('aria-valuenow', 100);
          progressBar.textContent = 'Success';
          progressBar.classList.add('success');
          alert('Item listed successfully!');
          form.reset();
          imagePreview.innerHTML = '';
          charCount.textContent = '0';
          form.classList.remove('was-validated');
          progressBar.style.width = '0%';
          progressBar.setAttribute('aria-valuenow', 0);
          progressBar.textContent = `Step 0/${fields.length}`;
          progressBar.classList.remove('success');
          submitBtn.disabled = false;
          submitBtn.textContent = 'List Item';
        }, 1000);
      }
      
      form.classList.add('was-validated');
    });

    // Image preview
    imageInput.addEventListener('change', function() {
      imagePreview.innerHTML = '';
      const files = this.files;
      
      if (files.length > 3) {
        alert('You can upload a maximum of 3 images.');
        this.value = '';
        return;
      }
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          alert('Please upload valid image files.');
          this.value = '';
          imagePreview.innerHTML = '';
          return;
        }
        
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        imagePreview.appendChild(img);
      }
      updateProgress(); // Update progress after image change
    });

    // Description character counter
    description.addEventListener('input', function() {
      charCount.textContent = this.value.length;
      if (this.value.length > 500) {
        this.value = this.value.slice(0, 500);
        charCount.textContent = '500';
      }
    });

    // Date validation on blur
    startDate.addEventListener('blur', function() {
      const today = new Date().toISOString().split('T')[0];
      if (this.value && this.value < today) {
        this.classList.add('is-invalid');
        this.nextElementSibling.textContent = 'Start date cannot be in the past.';
      } else {
        this.classList.remove('is-invalid');
        this.nextElementSibling.textContent = 'Please select a start date.';
      }
      if (this.value) {
        endDate.min = this.value;
      }
      updateProgress(); // Update progress after date change
    });
    
    endDate.addEventListener('blur', function() {
      if (this.value && startDate.value && this.value < startDate.value) {
        this.classList.add('is-invalid');
        this.nextElementSibling.textContent = 'End date must be after start date.';
      } else {
        this.classList.remove('is-invalid');
        this.nextElementSibling.textContent = 'Please select an end date.';
      }
      updateProgress(); // Update progress after date change
    });

    // Clear invalid state on input
    startDate.addEventListener('input', function() {
      this.classList.remove('is-invalid');
      this.nextElementSibling.textContent = 'Please select a start date.';
    });
    
    endDate.addEventListener('input', function() {
      this.classList.remove('is-invalid');
      this.nextElementSibling.textContent = 'Please select an end date.';
    });
  });
</script>