// Style Switcher - No inline onclick
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Toggle style switcher
  const styleSwitcherToggle = document.querySelector('.style-switcher-toggler');
  const styleSwitcher = document.querySelector('.style-switcher');

  if (styleSwitcherToggle && styleSwitcher) {
    styleSwitcherToggle.addEventListener('click', () => {
      styleSwitcher.classList.toggle('open');
    });
  }

  // Hide style switcher on scroll
  window.addEventListener('scroll', () => {
    if (styleSwitcher && styleSwitcher.classList.contains('open')) {
      styleSwitcher.classList.remove('open');
    }
  });

  // Theme color switcher
  const alternateStyles = document.querySelectorAll('.alternate-style');

  function setActiveStyle(color) {
    alternateStyles.forEach((style) => {
      if (color === style.getAttribute('title')) {
        style.removeAttribute('disabled');
      } else {
        style.setAttribute('disabled', 'true');
      }
    });
  }

  // Color buttons (event delegation)
  const colorsContainer = document.querySelector('.style-switcher .colors');
  if (colorsContainer) {
    colorsContainer.addEventListener('click', function (e) {
      const colorSpan = e.target.closest('[data-color]');
      if (colorSpan) {
        const color = colorSpan.getAttribute('data-color');
        if (color) {
          setActiveStyle(color);
        }
      }
    });
  }

  // Theme light and dark
  const dayNight = document.querySelector('.day-night');
  if (dayNight) {
    dayNight.addEventListener('click', () => {
      const icon = dayNight.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-sun');
        icon.classList.toggle('fa-moon');
      }
      document.body.classList.toggle('dark');
    });
  }

  // Initialize day/night icon on load
  window.addEventListener('load', () => {
    if (dayNight) {
      const icon = dayNight.querySelector('i');
      if (icon) {
        if (document.body.classList.contains('dark')) {
          icon.classList.add('fa-sun');
        } else {
          icon.classList.add('fa-moon');
        }
      }
    }
  });
});
