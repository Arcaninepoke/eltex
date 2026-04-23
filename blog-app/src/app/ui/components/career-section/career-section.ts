import {Component} from '@angular/core';

@Component({
  selector: 'app-career-section',
  imports: [],
  templateUrl: './career-section.html',
  styleUrl: './career-section.scss',
})
export class CareerSection {
  jobs = [
    {
      company: 'Аврора - (2024 - 2025)',
      title: 'Бета-тестирование',
      desc:
          'Тестировал новые версии отечественной операционной системы Аврора, вроде прикольно было.',
      icon: 'images/photos/avrora.jpg'
    },
    {
      company: 'VK Testers - (2024 - 2026)',
      title: 'Веб-тестирование, UI, UX, уязвимости',
      desc:
          'Прошёл несколько интенсивов и курсов от местных наставников, имею опыт работы с Charles и PostMan.',
      icon: 'images/photos/vktesters.jpg'
    },
    {
      company: 'Академия Eltex - (2026 - 20XX)',
      title: 'Разработка Angular',
      desc: 'Причина по которой вы видите данную страницу!',
      icon: 'images/photos/eltex.jpg'
    }
  ];
}
