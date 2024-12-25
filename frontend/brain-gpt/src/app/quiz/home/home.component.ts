import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    username: string = '';
    topic: string = '';
    difficulty: string = '';
    numQuestions: any;
  
    constructor(private router: Router, private quizService:QuizService, private route:ActivatedRoute) { }

    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.username = params['username'];
        console.log('Username:', this.username);
      });
    }
  
    generateContest(): void {
      this.quizService.createContest(this.username, this.topic, this.difficulty, this.numQuestions).subscribe((res)=>{
        console.log(res);
        this.router.navigate(['/quiz/play']);
      })
    }

}
