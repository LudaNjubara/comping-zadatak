import { Footer } from '@/app/shared/components/common/footer/footer/footer';
import { Header } from '@/app/shared/components/common/header/header/header';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
