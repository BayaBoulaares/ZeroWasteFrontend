import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {InventoryService} from "../../../Services/inventory.service";
import {ProductCategory} from "../../../Entities/product-category";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit{
  productForm!: FormGroup;
  isEditMode = false;
  productId!: number;
  categories = Object.values(ProductCategory);
  selectedFile!: File;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      stockLevel: [0, [Validators.required, Validators.min(0)]],
      expireDate: [''],
      imgPath:[''],
      productDescription:['',Validators.required],
      productPrice:['',Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = +id;
        this.loadProduct(this.productId);
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  

  loadProduct(id: number) {
    this.inventoryService.getProductById(id).subscribe(product => {
      this.productForm.patchValue(product);
    });
  }

  onSubmit() {
    if (this.productForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('product', new Blob([JSON.stringify(this.productForm.value)], { type: 'application/json' }));
      formData.append('image', this.selectedFile);
  
      if (this.isEditMode) {
        this.inventoryService.updateProductWithImage(this.productId, formData).subscribe(() => {
          this.router.navigate(['/admin/inventory/product']);
        });
      } else {
        this.inventoryService.addProductWithImage(formData).subscribe(() => {
          this.router.navigate(['/admin/inventory/product']);
        });
      }
    }
  }
  

  onCancel() {
    this.router.navigate(['/products']);
  }
 
}
