import { Component } from '@angular/core';
import { Product } from '../../../../Entities/product';
import { ProductService } from '../../../../Services/product.service';
import { OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
import * as AOS from 'aos';
import { CartService } from 'src/app/features/inventorymanagement/Services/cart.service'; // adapte le chemin
import { SalesService } from 'src/app/features/inventorymanagement/Services/sales.service';

@Component({
  selector: 'app-product-section',
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.css']
})
export class ProductSectionComponent  implements OnInit{
  recommendedProducts: { product_name: string; quantity_sold: number; score: number; total: number; orderKg: number }[] = [];
  products: Product[]=[];
  searchText: string = '';

  baseImageUrl: string = 'http://localhost:8089/gaspillagezero/img/';
  categories: string[] = ['Meat', 'Vegetables', 'Fruits', 'Beverages', 'Bakery' , 'Seafood' , 'Frozen', 'Spices' , 'Dairy'];
  selectedCategory: string = 'Meat';
  constructor(private productService: ProductService,
    private cartService: CartService,
    private salesService: SalesService
  ){}
  ngOnInit(): void {
    this.getTopProducts();
    AOS.init();
    this.getAllProducts();
    register();
    new Swiper('.swiper.init-swiper', {
      loop: true,
      speed: 600,
      autoplay: {
        delay: 5000,
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 40,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 1,
        },
      },
    });

  }
  getTopProducts() {
    this.productService.getTopProducts().subscribe((data: any[]) => {
      console.log('Top products:', data); // 👈 Ajoute ça
      this.recommendedProducts = data.map(item => ({
        product_name: item.product_name,
        quantity_sold: item.quantity_sold,
        score: item.score,
        total: item.total,
        orderKg: 0 // Ajout d'un champ "orderKg"
      }));
    }, error => {
      console.error('Error loading top products', error);
    });
  }
  
  
  getAllProducts() {
    this.productService.getAllProducts().subscribe((data) => {
      console.log(data);
  
      this.products = data.map(product => ({
        ...product,
        imgPath: product.imgPath ? this.baseImageUrl + product.imgPath : '', // Correction ici
        orderKg: 0
      }));
    });
  }
  
  

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  
  orderProduct(product: any): void {
    if (!product.orderKg || product.orderKg <= 0) {
      alert('Please enter a valid quantity in kilograms.');
      return;
    }
  
    const saleRecord = {
      quantitySold: product.orderKg,
      dateSale: new Date(),
      total: product.orderKg * product.productPrice,
      product: product
    };
  
    this.salesService.addSalesRecord(saleRecord).subscribe({
      next: (res) => {
        console.log('Sale record added:', res);
  
        // 🛒 Ajouter au panier
        this.cartService.addOrder({
          productId: product.productId,
          productName: product.productName,
          productPrice: product.productPrice,
          orderKg: product.orderKg
        });
  
        alert('Order placed successfully!');
  
        // Optionnel : Réinitialiser la quantité après l'ajout au panier
        product.orderKg = 0;
      },
      error: (err) => {
        console.error('Error adding sale record:', err);
        alert('Failed to place order.');
      }
    });
  }
  get filteredProduct() {
    const search = this.searchText.toLowerCase();
  
    return this.products.filter(product =>
      (this.searchText
        ? product.productName.toLowerCase().includes(search)
        : product.category === this.selectedCategory)
    );
  }
  
  startVoiceRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // ou 'fr-FR' si tu veux le français
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.start();
  
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("Voice input:", transcript);
      this.searchText = transcript;
    };
  
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      alert("Error with speech recognition: " + event.error);
    };
  }
  

}
