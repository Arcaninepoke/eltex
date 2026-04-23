import {Component} from '@angular/core';

@Component({
  selector: 'app-skills-section',
  imports: [],
  templateUrl: './skills-section.html',
  styleUrl: './skills-section.scss',
})
export class SkillsSection {
  skills = [
    {skill: 'skill 1'}, {skill: 'skill 2'}, {skill: 'skill 3'},
    {skill: 'skill 4'}, {skill: 'skill 5'}, {skill: 'skill 6'},
    {skill: 'skill 7'}, {skill: 'skill 8'}
  ]
}
