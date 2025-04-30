import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData = {
    name: '',
    email: '',
    city: '',
    image: null as string | File | null
  };
  imagePreviewUrl: string | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  // Load user data on component initialization
  loadUserData() {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userData.name = user.name || '';
      this.userData.email = user.email || '';
      this.userData.city = user.city || '';
      this.imagePreviewUrl = user.image || 'assets/default-profile.png';
    } else {
      this.showError("Unable to load user data. Please log in again.");
    }
  }

  async handleUpdate() {
    // Validate necessary fields
    if (!this.userData.name || !this.userData.city) {
      this.showError("All fields are required except email (cannot be changed).");
      return;
    }
    const user = this.userService.getUser();
    const userId = user.id;
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    console.log('User ID:', userId);
  console.log('Token:', token);

    if (!userId || !token) {
      this.showError("Unable to authenticate user.");
      return;
    }

    try {
      let imageUrl = this.userData.image;

      // Handle image upload if a new file is selected
      if (this.userData.image instanceof File) {
        const uploadData = new FormData();
        uploadData.append('file', this.userData.image);
        uploadData.append('upload_preset', 'gaspillagezero');

        const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dmdvu18ki/image/upload', {
          method: 'POST',
          body: uploadData
        });

        const cloudinaryResult = await cloudinaryResponse.json();
        if (!cloudinaryResponse.ok) {
          throw new Error(cloudinaryResult.error?.message || "Image upload failed");
        }
        imageUrl = cloudinaryResult.secure_url;
      }

      // Prepare updated user data
      const updatedData = { ...this.userData, image: imageUrl };

      // Call API to update user data
      const response = await this.userService.updateUser(userId, updatedData, token);
      if (response.statusCode === 200) {
        this.successMessage = "Profile updated successfully!";
        localStorage.setItem('user', JSON.stringify(response.user)); // Update localStorage
        this.loadUserData(); // Refresh displayed data
      } else {
        this.showError(response.message);
      }
    } catch (error: any) {
      this.showError(error.message || "An error occurred during profile update.");
    }
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.userData.image = file;

      // Display image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}