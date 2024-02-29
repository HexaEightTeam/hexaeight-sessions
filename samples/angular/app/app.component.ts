import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HexaeightSessionComponent } from './hexaeight-session/hexaeight-session.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HexaeightSessionComponent,FormsModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ASample';
}
