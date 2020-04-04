from linnea.web_interface import run_linnea
from django.shortcuts import render
from django.http import JsonResponse
from .models import SResult, FResult

def create_input(request):
    Success_Results = SResult.objects.all()
    Failure_Results = FResult.objects.all()
    response_data = {}

    if request.POST.get('action') == 'post':
        description = request.POST.get('description')
        response_data['description'] = description
        
        try:
            answer = run_linnea(description)
            SResult.objects.create(
                description = description,
                result = answer,
                git_version = '3d1ce0ed251180eb31bc7f8dcbb169e43c6cfff6',
            )
            response_data['answer'] = answer
        except Exception as e:
            print(e)
            FResult.objects.create(
                description = description,
                result = e,
                reason = 'Expression Error!!!',
                git_version = '3d1ce0ed251180eb31bc7f8dcbb169e43c6cfff6',
            )
            response_data['answer'] = e
        
        response_data['git_version'] = '3d1ce0ed251180eb31bc7f8dcbb169e43c6cfff6'
        

        ########
        # Post.objects.create(
        #     description = description,
        #     answer = response_data['answer'],
        #     git_version = response_data['git_version'],
        #     )
            
        return JsonResponse(response_data)

        # return render(request, 'create_input.html', {'posts':posts})
    return render(request, 'create_input.html', {'Success_Results': Success_Results, 'Failure_Results': Failure_Results} )

# input1 = """
#     n = 1500
#     m = 1000

#     Matrix X(n, m) <FullRank>
#     ColumnVector y(n) <>
#     ColumnVector b(m) <>

#     b = inv(trans(X)*X)*trans(X)*y
#     """

# print(run_linnea(input1))




# template = 'linnea_demo.html'
# return render(request, template)
