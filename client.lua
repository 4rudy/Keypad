
QBCore = exports["qb-core"]:GetCoreObject()
local result = false
local inGame = false

RegisterNUICallback('close', function(data, cb)
    inGame = false
    SetNuiFocus(false, false)
end)

RegisterNUICallback('keypadResult', function(data, cb)
    cb('ok')
	SetNuiFocus(false, false)
    inGame = false
    result = data.status
end)

function StartGame(password)
    inGame = true
    result = nil
    SendNUIMessage({
        type = "open",
        password = password
    })
    repeat
        SetNuiFocus(true, true)
        SetPauseMenuActive(false)
        DisableControlAction(0, 1, true)
        DisableControlAction(0, 2, true)
        Wait(0)
    until not inGame
    return result
end

function PasswordInput(password)
    return StartGame(password)
end

-- RegisterCommand("keypad",function()
--     local testPassword = "aBc12"
--     print('password: '..testPassword)
--     local test = exports['4rd-keypad']:PasswordInput(testPassword)
--     print(test)
-- end)

exports('PasswordInput', PasswordInput)
