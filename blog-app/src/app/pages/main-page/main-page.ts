import {Component} from '@angular/core';

import {CareerSection} from '../../ui/components/career-section/career-section';
import {HeroSection} from '../../ui/components/hero-section/hero-section';
import {HobbySection} from '../../ui/components/hobby-section/hobby-section';
import {LatestSection} from '../../ui/components/latest-section/latest-section';
import {SkillsSection} from '../../ui/components/skills-section/skills-section';

@Component({
  selector: 'app-main-page',
  imports:
      [CareerSection, HeroSection, SkillsSection, LatestSection, HobbySection],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
}
