using System.IO;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IO.Abstractions;
using Microsoft.AspNetCore.Mvc.Routing;
using Moq;
using Xunit;
using Nest.Controllers; // Adjust namespace as needed
using Nest.Models;
using Nest.DAL;
using Nest.ViewModels;
using Nest.Utilities;
#nullable disable