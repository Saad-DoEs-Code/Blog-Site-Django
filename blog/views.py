from django.shortcuts import render


# Create your views here.
def index(req):

    return render(req, "blog/index.html")


def posts(req):
    pass


def post_details(req):
    pass
