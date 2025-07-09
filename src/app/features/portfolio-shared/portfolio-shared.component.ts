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
import { ActivatedRoute } from '@angular/router';
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
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { CertifMediaService } from '../../_services/certif-media.service';

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
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private certifMediaService: CertifMediaService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const targetUserId = +idParam; // Convert string to number
        this.loadData(targetUserId);
      } else {
        // Fallback to authenticated user's ID if no ID in route (e.g., for viewing own portfolio)
        const authenticatedUserId = this.tokenService.getUser().id;
        if (authenticatedUserId) {
          this.loadData(authenticatedUserId);
        }
      }
    });
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

  exportToPdf(): void {
    const data = document.querySelector<HTMLElement>('.cv-container');
    if (data) {
      // Temporarily hide the button before taking the screenshot
      const button = document.querySelector('.export-pdf-button') as HTMLElement;
      if (button) {
        button.style.display = 'none';
      }

      html2canvas(data, { scale: 2, useCORS: true } as any).then((canvas: HTMLCanvasElement) => {
        // Show the button again after taking the screenshot
        if (button) {
          button.style.display = 'block';
        }

        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
        const width = pdf.internal.pageSize.getWidth();
        const height = canvas.height * width / canvas.width;
        pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);

        const fileName = `${this.profile?.firstName || 'user'}-${this.profile?.lastName || 'portfolio'}-CV.pdf`.toLowerCase();
        pdf.save(fileName);
      }).catch((error: any) => {
        console.error('Error generating PDF:', error);
        // Ensure the button is visible even if an error occurs
        if (button) {
          button.style.display = 'block';
        }
      });
    }
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

  getCertificationLink(certification: CertificationResponse): string {
    if (certification.certifMediaId) {
      return `${this.certifMediaService.apiUrl}/download/${certification.certifMediaId}`;
    } else if (certification.validationLink) {
      return certification.validationLink;
    } else if (certification.certificateUrl) {
      return certification.certificateUrl;
    }
    return '#'; // Fallback for no link
  }

  isLinkValid(url: string | undefined): boolean {
    return url !== '#' && url !== undefined && url !== null && url.trim() !== '';
  }
}
