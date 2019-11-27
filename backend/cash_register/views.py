import json
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from cash_register.CashRegister.application import CashRegister

# Create your views here.


@permission_classes((AllowAny, ))
class cashRegisterAPI(APIView):
    """ 
    API Endpoint : /cashregister/API/
    Example Input : {"transactions":[["10","12"]],"specialFnc":{"divisibleBy3":true,"excludeFives":false},"currency":{"payment_country":"USD","change_country":"USD"}}
    Example Ouput : [{"amt_owed":1000,"amt_tendered":1200,"change_due":["2 Dollar Bills"]}}]

    Utilizes CashRegister class to take in transactions and return the change due in the most efficient manor
    * Allows predefined 'special functions' to be passed and called within the class
    """
    parser_classes = [JSONParser]

    def post(self, request, format=None):
        currency = request.data['currency']
        params = {
            'json_transactions': request.data['transactions'],
            'payment_cc': currency['payment_country'],
            'change_cc': currency['change_country'],
            'specialFnc': request.data['specialFnc']
        }

        cashRegister = CashRegister(**params)
        cashRegister.createChange()
        return Response(cashRegister.exportChange())
