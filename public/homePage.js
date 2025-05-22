"use strict"


const logoutButton = new LogoutButton();
const ratesBoard = new RatesBoard();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();

//Выход

logoutButton.action = function() {
	ApiConnector.logout(function(response) {
		if (response.success) {
			location.reload()
		}
	});
};



// Отображение пррофиля 

ApiConnector.current((response) => {
	if (response.success) {
		ProfileWidget.showProfile(response.data)
	}
});



// показ курса валют

function takeExchangeRates() {
	ApiConnector.getStocks((response) => {
		if (response.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response.data);
		}
	});
}

takeExchangeRates();
setInterval(takeExchangeRates, 60000)


// Операции с деньгами

// Пополнение баланса

moneyManager.addMoneyCallback = function(data) {
	ApiConnector.addMoney(data, (response) => {
		if (response.success) {
			ProfileWidget.showProfile(response.data)
			moneyManager.setMessage(true, 'Пополнение прошло успешно!');
		} else {
			moneyManager.setMessage(false, response.error)
		}
	});
}


// Конвертирование валюты

moneyManager.conversionMoneyCallback = (data) => {
	ApiConnector.convertMoney(data, (response) => {
		if (response.success) {
			ProfileWidget.showProfile(response.data)
			moneyManager.setMessage(true, 'Конвертация прошла успешно!')
		} else {
			moneyManager.setMessage(false, response.error)
		}
	})
}

// перевод валюты 

moneyManager.sendMoneyCallback = (data) => {
	ApiConnector.transferMoney(data, (response) => {
		if (response.success) {
			ProfileWidget.showProfile(response.data)
			moneyManager.setMessage(true, 'Перевод прошел успешно!')
		} else {
			moneyManager.setMessage(false, response.error)
		}
	})
}


// Избранные 


function updateFavoritesWidget(){
    ApiConnector.getFavorites(response => {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
	};
});
}

updateFavoritesWidget()

favoritesWidget.addUserCallback = (data) => {
	ApiConnector.addUserToFavorites(data, (response) => {
		if (response.success) {
            updateFavoritesWidget()
			favoritesWidget.setMessage(true, 'Добавление прошло успешно!')
		} else {
			favoritesWidget.setMessage(false, response.error);
		}
	})
}

favoritesWidget.removeUserCallback = (data) => {
	ApiConnector.removeUserFromFavorites(data, (response) => {
		if (response.success) {
            updateFavoritesWidget()
			favoritesWidget.setMessage(response.success, 'Удалние прошло успешно!')
		} else {
			favoritesWidget.setMessage(response.success, response.error);
		};
	});
}