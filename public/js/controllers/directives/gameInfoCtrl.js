export default function($scope, $document) {
    const UT = this;

    UT.combatMode = true;

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

    //Initialize all panels to page one
    UT.page = 1;
    UT.rightAvailable = true;

    charIcon.on('click', () => {
      resetPanel();
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
      resetPanel();
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
        resetPanel();
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
        resetPanel();
        if(spellsIcon.hasClass('active')) {
          spellsPanel.removeClass('active');
          spellsIcon.removeClass('active');
        } else {
          angular.element(document.querySelectorAll('.active')).removeClass('active');
          spellsPanel.addClass('active');
          spellsIcon.addClass('active');
        }
        UT.page = 1;
    })

    UT.switchPage = (pages, direction) => {
      if(direction === "right") {
        if(UT.page < pages) {
          UT.page++;
          UT.leftAvailable = true;
          if(UT.page === pages) {
            UT.rightAvailable = false;
          }
        }
      }
      if(direction === "left") {
        UT.page--;
        UT.rightAvailable = true;
        if(UT.page === 1) {
          UT.leftAvailable = false;
        }
      }
    }

    function resetPanel() {
      UT.page = 1;
      UT.rightAvailable = true;
      UT.leftAvailable = false;
      $scope.$apply();
    }
}
