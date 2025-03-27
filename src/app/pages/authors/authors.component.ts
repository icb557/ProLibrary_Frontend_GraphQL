// import { Component } from '@angular/core';
// import { NavbarComponent } from '../../components/navbar/navbar.component';
// import { Router, RouterLink } from '@angular/router';
// import { NgStyle } from '@angular/common';
// import { FormAuthorComponent } from '../form-author/form-author.component';
// import { Author } from '../../interfaces/author';
// import { AuthorService } from '../../services/author.service';

// @Component({
//   selector: 'app-authors',
//   imports: [NavbarComponent, RouterLink, NgStyle, FormAuthorComponent],
//   templateUrl: './authors.component.html',
//   styleUrl: './authors.component.css'
// })

// export class AuthorsComponent {

//   rol = localStorage.getItem('rol')
//   showForm = false

//   currentIndex: number = 0;

//   list: Author[] = []

//   constructor(private _AuthorService: AuthorService, private router: Router) {
//   }

//   ngOnInit(): void {
//     if (this.router.url === '/categories/create' || /\/categories\/edit\/\d+/.test(this.router.url))
//       this.showForm = true
//     else
//       this.showForm = false
//     this.getCategories()
//   }

//   getCategories() {
//     this._categoryService.getAllCategory().subscribe((data) => {
//       this.listCategory = data
//       this.loadListImages()
//     })
//   }

//   loadListImages() {
//     let i = 0
//     while (i < this.listCategory.length) {
//       this.listImages.push(this.loadImage())
//       i++
//     }
//   }

//   loadImage(): string {
//     const imageUrl = this.images[this.currentIndex]
//     this.currentIndex++
//     if (this.currentIndex >= this.images.length) {
//       this.currentIndex = 0
//     }
//     return imageUrl
//   }

//   seeApps(catId: number) {
//     this.router.navigate([`/products/${catId}`])
//   }

//   deleteCategory(id: number, name: string) {
//     Swal.fire({
//       title: "Are you sure to remove the Category?",
//       showCancelButton: true,
//       confirmButtonText: "Yes, Delete it",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this._categoryService.deleteCategory(id).subscribe({
//           next: () => {
//             Swal.fire({
//               icon: "success",
//               title: "Successful delete Category",
//               text: `Category ${name} deleted!!`,
//               showConfirmButton: false,
//               timer: 1500
//             }).then(() => {
//               window.location.reload()
//             })
//           },
//           error: (e: HttpErrorResponse) => {
//             Swal.fire({
//               icon: "error",
//               title: "Error Deleting Category",
//               showConfirmButton: false,
//               timer: 1500
//             });
//           }
//         })
//       }
//     });
//   }
//   editCategory(id: number) {
//     this.router.navigate([`/categories/edit/${id}`])
//   }
//   addCategory() {
//     this.router.navigate(['/categories/create'])
//   }
// }
