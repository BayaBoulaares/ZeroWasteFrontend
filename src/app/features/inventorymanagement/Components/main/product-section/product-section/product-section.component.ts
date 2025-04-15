import { Component } from '@angular/core';
import { Product } from '../../../../Entities/product';
import { ProductService } from '../../../../Services/product.service';
import { OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
import * as AOS from 'aos';
import { CartService } from 'src/app/features/inventorymanagement/Services/cart.service'; // adapte le chemin

@Component({
  selector: 'app-product-section',
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.css']
})
export class ProductSectionComponent  implements OnInit{
  products: Product[]=[];
  categories: string[] = ['Meat', 'Vegetables', 'Fruits', 'Beverages', 'Bakery' , 'Seafood' , 'Frozen', 'Spices' , 'Dairy'];
  selectedCategory: string = 'Meat';
  constructor(private productService: ProductService,
    private cartService: CartService
  ){}
  ngOnInit(): void {
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
  getAllProducts() {
    this.productService.getAllProducts().subscribe((data) => {
      console.log(data);
     
      // Optionally log or process the meal data
      this.products = data.map(product => ({
        ...product,
        orderKg: 0
      }));
    });
  }
  get filteredProduct() {
    return this.products.filter(product => product.category === this.selectedCategory);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  
  orderProduct(product: any): void {
    if (!product.orderKg || product.orderKg <= 0) {
      alert('Please enter a valid quantity in kilograms.');
      return;
    }
  
    const productToOrder = {
      ...product,
      orderKg: Number(product.orderKg)
    };
  
    this.cartService.addOrder(productToOrder);
    product.orderKg = 0; // reset input
  }
  

}
