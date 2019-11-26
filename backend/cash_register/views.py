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
    parser_classes = [JSONParser]

    def post(self, request, format=None):
        currency = request.data['currency']
        params = {
            'import_method': "json",
            'export_method': "json",
            'json_transactions': request.data['transactions'],
            'payment_cc': currency['payment_country'],
            'change_cc': currency['change_country'],
            'specialFnc': request.data['specialFnc']
        }

        cashRegister = CashRegister(**params)
        cashRegister.createChange()
        return Response(cashRegister.exportChange())
