from linnea.web_interface import run_linnea
from django.shortcuts import render
from django.http import JsonResponse
from .models import Post

def create_input(request):
    posts = Post.objects.all()
    response_data = {}

    if request.POST.get('action') == 'post':
        description1 = request.POST.get('description')
        answer1 = run_linnea(description1)
        response_data['description'] = description1
        response_data['answer'] = answer1
        response_data['git_version'] = '3d1ce0ed251180eb31bc7f8dcbb169e43c6cfff6'

        Post.objects.create(
            description = description1,
            answer = answer1,
            git_version = '3d1ce0ed251180eb31bc7f8dcbb169e43c6cfff6',
            )
        return JsonResponse(response_data)

    return render(request, 'create_input.html', {'posts':posts})

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
