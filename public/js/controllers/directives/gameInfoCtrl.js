export default function($scope) {
    const UT = this;
    UT.hi = "hi";

    const utilityBar = angular.element(document.querySelector('.utility-bar'));

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
      angular.element(document.querySelectorAll('.active')).removeClass('active');
      console.log(angular.element(document.querySelectorAll('.active')).removeClass('active'));
      charPanel.addClass('active');
      charIcon.addClass('active');
    })

    inventoryIcon.on('click', () => {
      angular.element(document.querySelectorAll('.active')).removeClass('active');
      inventoryPanel.addClass('active');
      inventoryIcon.addClass('active');
    })

    partyIcon.on('click', () => {
      angular.element(document.querySelectorAll('.active')).removeClass('active');
      partyPanel.addClass('active');
      partyIcon.addClass('active');
    })

    spellsIcon.on('click', () => {
      angular.element(document.querySelectorAll('.active')).removeClass('active');
      spellsPanel.addClass('active');
      spellsIcon.addClass('active');
    })

    console.log(utilityBar);
}
