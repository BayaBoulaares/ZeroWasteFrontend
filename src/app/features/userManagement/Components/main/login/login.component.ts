declare var google: any;
import { AfterViewInit, Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../Services/user.service';

@Component({
  selector: 'appF-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginFComponent implements AfterViewInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private zone: NgZone
  ) {
    console.log('LoginComponent initialized!');

  }
  @Output() close = new EventEmitter<void>();

  ngAfterViewInit() {
    google.accounts.id.initialize({
      client_id: '240758916721-e108eq2rhn9og8judkgjbk7168caafiv.apps.googleusercontent.com',
      callback: (resp: any) => {
        this.zone.run(() => {
          console.log(resp);
          this.handleGoogleSignin(resp.credential);
        });
      }//this.handleGoogleResponse.bind(this),
    });
    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'filled_blue', size: 'large', shape: 'rectangular', text: 'continue_with' }
    );
  }
  async handleGoogleSignin(token: any) {

    try {
      const response = await this.userService.loginWithGoogle(token);
      console.log(response)
      if (response.statusCode == 200) {
        this.storeAuthData(response.token, response.role, response.user);
        //this.router.navigate(['home'])
        this.closeModal();
        if (response.role === 'ADMIN') {
          console.log('Admin logged in');
          this.router.navigate(['admin']);
        }

        /* console.log(localStorage.getItem('token',))
        console.log(localStorage.getItem('role',)) */
        console.log(localStorage.getItem('user',))
      } else {
        this.showError(response.message)
      }
    } catch (error: any) {
      this.showError(error.message)
    }
  }
  closeModal() {
    this.close.emit();
  }

  email: string = ''
  password: string = ''
  errorMessage: string = ''
  rememberMe: boolean = false;
  showPassword = false;
  isSignup = false;

  toggleFormMode() {
    this.isSignup = !this.isSignup;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  async handleSubmit() {

    if (!this.email || !this.password) {
      this.showError("Email and Password is required");
      return
    }

    try {
      const response = await this.userService.login(this.email, this.password);
      if (response.statusCode == 200) {
        this.storeAuthData(response.token, response.role, response.user);
        //this.router.navigate(['home'])
        if (response.role === 'ADMIN') {
          console.log('Admin logged in');
          this.router.navigate(['admin']);
        }
        this.closeModal();
        window.location.reload();
        console.log(this.userService.getUser())
      } else {
        this.showError(response.message)
      }
    } catch (error: any) {
      this.showError(error.message)
    }

  }

  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = ''
    }, 3000)
  }


  //////////// sign up //////////////

  signupData = {
    name: '',
    email: '',
    password: '',
    city: '',
    role: 'user',
    image: null as File | null
  };

  async handleRegister() {
    if (!this.signupData.name || !this.signupData.email || !this.signupData.password || !this.signupData.city) {
      this.showError("All fields are required");
      return;
    }

    try {
      let imageUrl = null;

      if (this.signupData.image) {
        // Step 1: Moderate the image before uploading
        const moderationResult = await this.userService.moderateImage(this.signupData.image);

        // Check if the image passed moderation
        if (moderationResult.verdict !== "approved") {
          this.showError(`Image rejected: ${moderationResult.reason}`);
          return;
        }

        // Step 2: Proceed with Cloudinary upload if image is approved
        const uploadData = new FormData();
        uploadData.append('file', this.signupData.image);
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
        this.signupData.image = imageUrl;
      }

      // Step 3: Proceed with registration
      const response = await this.userService.register(this.signupData);
      if (response.statusCode === 201) {
        this.storeAuthData(response.token, response.role, response.user);
        this.toggleFormMode();
      } else {
        this.showError(response.message);
      }
    } catch (error: any) {
      this.showError(error.message || "An error occurred during registration");
    }
}

  showForgotPassword: boolean = false;

  toggleForgotPassword() {
    this.showForgotPassword = !this.showForgotPassword;
  }
  forgotPasswordEmail: string = '';
  successMessage: string = '';

  async handleForgotPassword() {
    if (!this.forgotPasswordEmail) {
      this.showError("Email is required");
      return;
    }

    try {
      const response = await this.userService.sendResetEmail(this.forgotPasswordEmail);
      if (response.statusCode === 200) {
        this.successMessage = "Reset link sent! Check your inbox.";
        this.errorMessage = '';
      } else {
        this.showError(response.message);
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  storeAuthData(token: string, role: string, user: any) {
    localStorage.clear();
    sessionStorage.clear();
    const storage = this.rememberMe ? localStorage : sessionStorage;

    storage.setItem('token', token);
    storage.setItem('role', role);
    storage.setItem('user', JSON.stringify(user));
  }



  imagePreviewUrl: string | null = null;

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.signupData.image = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

}
