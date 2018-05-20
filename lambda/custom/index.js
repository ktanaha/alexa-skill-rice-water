"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa = __importStar(require("ask-sdk-core"));
const title = 'お米のお水';
const start_message = '炊きたいお米の量を合数で教えてください';
const help_message = '炊きたいお米の種類と合数を教えてください';
const rice_message = 'お米の種類を白米・玄米・もち米のどれかから選んでください';
const amount_message = '炊きたいお米の合数を教えてください';
/* Intent Handlers */
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(start_message)
            .reprompt(start_message)
            .withSimpleCard(title, start_message)
            .getResponse();
    }
};
const RiceHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'RiceIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const intent = request.intent;
        if (!intent.slots) {
            return handlerInput.responseBuilder
                .speak(start_message)
                .reprompt(start_message)
                .getResponse();
        }
        //let rice: string = '白米胃';
        const rice = intent.slots.rice.value;
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        if (!attributes.rice && !rice) {
            return handlerInput.responseBuilder
                .speak(rice_message)
                .withSimpleCard(title, rice_message)
                .getResponse();
        }
        else {
            attributes.rice = rice;
            handlerInput.attributesManager.setSessionAttributes(attributes);
        }
        //let amount: string = request.intent.slots.Amount.value;
        const amount = intent.slots.amount.value;
        if (!attributes.amount && !amount) {
            return handlerInput.responseBuilder
                .speak(amount_message)
                .withSimpleCard(title, amount_message)
                .getResponse();
        }
        else {
            attributes.amount = amount;
        }
        const water = measureWater(rice, amount);
        const message = '${rice}の${amount}合の水の量は${water}ccです';
        return handlerInput.responseBuilder
            .speak(message)
            .withSimpleCard(title, message)
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(help_message)
            .reprompt(help_message)
            .withSimpleCard(title, help_message)
            .getResponse();
    }
};
const ExitIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
                || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('了解しました。終了します。')
            .getResponse();
    }
};
const ErrorHandler = {
    canHandle(handlerInput, error) {
        return error.name.startsWith('AskSdk');
    },
    handle(handlerInput, error) {
        return handlerInput.responseBuilder
            .speak('スキルの実行中にエラーが発生しました。最初からやり直してください。')
            .getResponse();
    }
};
/*
  お米を炊くのに必要な水の量を計算します。
  1の位は四捨五入して計算します。
*/
function measureWater(rice, amount) {
    let result = 0;
    if (rice === '白米') {
        result = (Number.parseInt(amount) * 180) * 1.2;
    }
    else if (rice === '玄米') {
        result = (Number.parseInt(amount) * 180) * 1.8;
    }
    else if (rice === 'もち米') {
        result = (Number.parseInt(amount) * 180) * 0.8;
    }
    result = Math.floor(result * Math.pow(10, 1)) / Math.pow(10, 1);
    return Math.round(result / 10) * 10;
}
const skillBuilders = Alexa.SkillBuilders.custom();
exports.handler = skillBuilders
    .addRequestHandlers(LaunchRequestHandler, RiceHandler, HelpIntentHandler, ExitIntentHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();
//# sourceMappingURL=index.js.map