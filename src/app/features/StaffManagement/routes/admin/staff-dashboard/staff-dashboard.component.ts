

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DashboardService } from '../../../Services/dashboard.service';

declare const ApexCharts: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.scss']
})
export class StaffDashboardComponent implements OnInit, AfterViewInit {
  // Staff data
  staffStats: any = {
    totalEmployees: 0,
    totalShifts: 0,
    totalTrainingSessions: 0,
    averageEmployeeSalary: 0,
    shiftsThisMonth: 0,
    trainingSessionsThisMonth: 0,
    roleDistribution: []
  };
  
  monthlyStats: any[] = [];
  roleBasedStats: any = {};
  loading = true;
  error = '';
  currentYear = new Date().getFullYear();
  username = 'Nour';
  
  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Load staff statistics
    this.dashboardService.getStaffStatistics().subscribe({
      next: (data) => {
        this.staffStats = data;
        console.log('Staff stats loaded:', this.staffStats);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load staff statistics';
        console.error('Error loading staff statistics:', err);
        this.loading = false;
      }
    });
    
    // Load monthly statistics
    this.dashboardService.getMonthlyStatistics().subscribe({
      next: (data) => {
        this.monthlyStats = data;
        console.log('Monthly stats loaded:', this.monthlyStats);
        // We'll initialize charts after data is loaded
      },
      error: (err) => {
        console.error('Error loading monthly statistics:', err);
      }
    });
    
    // Load role-based statistics
    this.dashboardService.getRoleBasedStatistics().subscribe({
      next: (data) => {
        this.roleBasedStats = data;
        console.log('Role stats loaded:', this.roleBasedStats);
      },
      error: (err) => {
        console.error('Error loading role-based statistics:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    // We'll initialize charts after a short delay
    setTimeout(() => {
      // First check if data is loaded
      if (this.monthlyStats.length > 0 || !this.loading) {
        this.initCharts();
      } else {
        // If data isn't loaded yet, wait a bit more
        setTimeout(() => this.initCharts(), 1000);
      }
    }, 500);
  }

  initCharts(): void {
    // Extract data for charts
    const months = this.monthlyStats.length > 0 ? 
      this.monthlyStats.map(stat => stat.month.substring(0, 3)) : 
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const shiftsData = this.monthlyStats.length > 0 ? 
      this.monthlyStats.map(stat => stat.shiftsCount) : 
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    
    const trainingsData = this.monthlyStats.length > 0 ? 
      this.monthlyStats.map(stat => stat.trainingsCount) : 
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // Staff Activity Chart (replacing Total Revenue Chart)
    if (document.getElementById('totalRevenueChart')) {
      const totalRevenueChart = new ApexCharts(document.getElementById('totalRevenueChart'), {
        series: [
          { name: 'Shifts', data: shiftsData },
          { name: 'Training Sessions', data: trainingsData }
        ],
        chart: {
          height: 300,
          type: 'line',
          toolbar: { show: false }
        },
        stroke: { curve: 'smooth' },
        grid: {
          borderColor: '#f1f1f1',
        },
        xaxis: {
          categories: months
        },
        yaxis: {
          title: {
            text: 'Count'
          }
        }
      });
      totalRevenueChart.render();
    }

    // Staff Growth Chart
    if (document.getElementById('growthChart')) {
      // Get percentage of employees hired this month
      const currentMonthIndex = new Date().getMonth();
      const currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());
      
      let hiredThisMonth = 0;
      if (this.monthlyStats.length > 0) {
        const monthStat = this.monthlyStats.find(stat => stat.month === currentMonthName);
        hiredThisMonth = monthStat ? monthStat.employeeCount : 0;
      }
      
      // Calculate percentage based on total employees
      const growthPercentage = this.staffStats.totalEmployees > 0 
        ? Math.round((hiredThisMonth / this.staffStats.totalEmployees) * 100) 
        : 0;
      
      const growthChart = new ApexCharts(document.getElementById('growthChart'), {
        series: [growthPercentage],
        chart: {
          height: 240,
          type: 'radialBar'
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            hollow: {
              size: '70%'
            },
            dataLabels: {
              name: {
                offsetY: -10,
                show: true,
                color: '#888',
                fontSize: '13px'
              },
              value: {
                formatter: function(val: number) {
                  return val + '%';
                },
                color: '#111',
                fontSize: '30px',
                show: true
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91]
          }
        },
        labels: ['Staff Growth']
      });
      growthChart.render();
    }

    // Employee Role Distribution Chart (replacing Order Statistics Chart)
    if (document.getElementById('orderStatisticsChart') && this.staffStats.roleDistribution?.length > 0) {
      const roles = this.staffStats.roleDistribution.map((role: any) => role.role);
      const counts = this.staffStats.roleDistribution.map((role: any) => role.count);
      
      const orderStatisticsChart = new ApexCharts(document.getElementById('orderStatisticsChart'), {
        series: counts,
        chart: {
          height: 180,
          type: 'donut'
        },
        labels: roles,
        colors: ['#696cff', '#00c3f8', '#56ca00', '#ffab00', '#ff3e1d'],
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        }
      });
      orderStatisticsChart.render();
    }

    // Monthly Shifts Chart (replacing Income Chart)
    if (document.getElementById('incomeChart')) {
      const incomeChart = new ApexCharts(document.getElementById('incomeChart'), {
        series: [{
          name: 'Monthly Shifts',
          data: shiftsData
        }],
        chart: {
          height: 215,
          parentHeightOffset: 0,
          parentWidthOffset: 0,
          toolbar: { show: false },
          type: 'area'
        },
        dataLabels: { enabled: false },
        stroke: {
          width: 2,
          curve: 'smooth'
        },
        legend: { show: false },
        markers: {
          size: 6,
          colors: 'transparent',
          strokeColors: 'transparent'
        },
        grid: {
          show: false,
          padding: { top: -25, bottom: -13 }
        },
        xaxis: {
          categories: months,
          labels: { show: true },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: { show: false },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            shadeIntensity: 0.4,
            opacityFrom: 0.7,
            opacityTo: 0.2
          }
        }
      });
      incomeChart.render();
    }

    // Training Sessions Chart (replacing Profile Report Chart)
    if (document.getElementById('profileReportChart')) {
      const profileReportChart = new ApexCharts(document.getElementById('profileReportChart'), {
        series: [
          {
            name: 'Training Sessions',
            data: trainingsData
          }
        ],
        chart: {
          height: 80,
          type: 'line',
          toolbar: { show: false },
          sparkline: { enabled: true }
        },
        stroke: { width: 2 },
        markers: { size: 6, colors: 'transparent', strokeColors: 'transparent' },
        grid: {
          show: false,
        },
        xaxis: {
          categories: months,
          labels: { show: false },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: { show: false }
      });
      profileReportChart.render();
    }
  }
}