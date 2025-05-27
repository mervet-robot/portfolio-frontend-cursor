import { Component, Input, OnInit } from '@angular/core';
import { ProfileService } from '../../_services/profile.service';
import { ExperienceService } from '../../_services/experience.service';
import { FormationService } from '../../_services/formation.service';
import { LanguageService } from '../../_services/language.service';
import { SoftSkillService } from '../../_services/soft-skill.service';
import { TechSkillService } from '../../_services/tech-skill.service';
import { CertificationService } from '../../_services/certification.service';
import { ProjectService } from '../../_services/project.service';
import { TokenService } from '../../_services/token.service';
import { Profile } from '../../_models/profile';
import { Experience } from '../../_models/experience';
import { Formation } from '../../_models/formation';
import { LanguageResponse } from '../../_models/language';
import { SoftSkillResponse } from '../../_models/soft-skill';
import { TechSkillResponse } from '../../_models/tech-skill';
import { CertificationResponse } from '../../_models/certification';
import { ProjectResponse } from '../../_models/project';
import { SocialLink } from '../../_models/social-link';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-portfolio-shared',
  standalone: false,
  templateUrl: './portfolio-shared.component.html',
  styleUrl: './portfolio-shared.component.scss'
})
export class PortfolioSharedComponent implements OnInit {
  @Input() userId?: number; // Optional input to view other users' portfolios

  profile: Profile | null = null;
  socialLinks: SocialLink[] = [];
  experiences: Experience[] = [];
  formations: Formation[] = [];
  techSkills: TechSkillResponse[] = [];
  softSkills: SoftSkillResponse[] = [];
  certifications: CertificationResponse[] = [];
  languages: LanguageResponse[] = [];
  projects: ProjectResponse[] = [];

  constructor(
    private profileService: ProfileService,
    private experienceService: ExperienceService,
    private formationService: FormationService,
    private softSkillService: SoftSkillService,
    private techSkillService: TechSkillService,
    private certificationService: CertificationService,
    private languageService: LanguageService,
    private projectService: ProjectService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const targetUserId = this.userId || this.tokenService.getUser().id;
    this.loadData(targetUserId);
  }

  loadData(userId: number): void {
    forkJoin([
      this.profileService.getProfile(userId),
      this.profileService.getSocialLinks(userId),
      this.experienceService.getExperiences(userId),
      this.formationService.getFormations(userId),
      this.techSkillService.getAllTechSkills(userId),
      this.softSkillService.getAllSoftSkills(userId),
      this.certificationService.getAllCertifications(userId),
      this.languageService.getLanguages(userId),
      this.projectService.getAllProjects(userId)
    ]).subscribe({
      next: ([
               profile,
               socialLinks,
               experiences,
               formations,
               techSkills,
               softSkills,
               certifications,
               languages,
               projects
             ]) => {
        this.profile = profile as Profile;
        this.socialLinks = socialLinks;
        this.experiences = experiences;
        this.formations = formations;
        this.techSkills = techSkills;
        this.softSkills = softSkills;
        this.certifications = certifications;
        this.languages = languages;
        this.projects = projects;
      },
      error: (err) => {
        console.error('Failed to load portfolio data:', err);
      }
    });
  }

  getProfilePictureUrl(): string {
    if (this.profile?.profilePicture) {
      if (this.profile.profilePicture.startsWith('http://') ||
        this.profile.profilePicture.startsWith('https://')) {
        return this.profile.profilePicture;
      }
      return this.profileService.getFullImageUrl(this.profile.profilePicture);
    }
    return 'assets/default-avatar.png';
  }

  getFontAwesomeSet(platform: string): string {
    const brands = ['linkedin', 'github', 'twitter', 'facebook', 'instagram'];
    return brands.includes(platform.toLowerCase()) ? 'fab' : 'fas';
  }

  getFontAwesomeIcon(platform: string): string {
    const p = platform.toLowerCase();
    switch (p) {
      case 'linkedin': return 'fa-linkedin';
      case 'github': return 'fa-github';
      case 'twitter': return 'fa-twitter';
      case 'facebook': return 'fa-facebook';
      case 'instagram': return 'fa-instagram';
      case 'portfolio': return 'fa-briefcase';
      case 'personal website': return 'fa-globe';
      case 'other': return 'fa-link';
      default: return 'fa-link';
    }
  }
}
