export default function($scope, $document) {
    const UT = this;

    //initialize to first page;
    UT.page1 = true;

    //Icons
    const charIcon = angular.element(document.querySelector('.char-icon svg'));
    const inventoryIcon = angular.element(document.querySelector('.inventory-icon svg'));
    const partyIcon = angular.element(document.querySelector('.party-icon svg'));
    const spellsIcon = angular.element(document.querySelector('.spells-icon svg'));

    //Panels
    const charPanel = angular.element(document.querySelector('.char-panel'));
    const inventoryPanel = angular.element(document.querySelector('.inventory-panel'));
    const partyPanel = angular.element(document.querySelector('.party-panel'));
    const spellsPanel = angular.element(document.querySelector('.spells-panel'));

    charIcon.on('click', () => {
      if(charIcon.hasClass('active')) {
        charPanel.removeClass('active');
        charIcon.removeClass('active');
      } else {
        angular.element(document.querySelectorAll('.active')).removeClass('active');
        charPanel.addClass('active');
        charIcon.addClass('active');
      }
    })

    inventoryIcon.on('click', () => {
        if(inventoryIcon.hasClass('active')) {
          inventoryPanel.removeClass('active');
          inventoryIcon.removeClass('active');
        } else {
          angular.element(document.querySelectorAll('.active')).removeClass('active');
          inventoryPanel.addClass('active');
          inventoryIcon.addClass('active');
        }
    })

    partyIcon.on('click', () => {
        if(partyIcon.hasClass('active')) {
          partyPanel.removeClass('active');
          partyIcon.removeClass('active');
        } else {
          angular.element(document.querySelectorAll('.active')).removeClass('active');
          partyPanel.addClass('active');
          partyIcon.addClass('active');
        }
    })

    spellsIcon.on('click', () => {
        if(spellsIcon.hasClass('active')) {
          spellsPanel.removeClass('active');
          spellsIcon.removeClass('active');
        } else {
          angular.element(document.querySelectorAll('.active')).removeClass('active');
          spellsPanel.addClass('active');
          spellsIcon.addClass('active');
        }
    })

    UT.switchPage = (page1) => {
      const leftArrow = angular.element(document.querySelector('.char-info-nav-left'));
      const rightArrow = angular.element(document.querySelector('.char-info-nav-right'));
      if(page1) {
        UT.page1 = false;
        rightArrow.removeClass('available');
        leftArrow.addClass('available');
      } else {
        UT.page1 = true;
        leftArrow.removeClass('available');
        rightArrow.addClass('available');
      }
    }
}
