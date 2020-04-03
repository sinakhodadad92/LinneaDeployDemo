using LinearAlgebra.BLAS
using LinearAlgebra

"""
    algorithm1(ml6::Array{Float64,1}, ml7::Array{Float64,1}, ml8::Array{Float64,1})

Compute
alpha = (x^T z x^T y).

# Arguments
- `ml6::Array{Float64,1}`: Operand x of size 10.
- `ml7::Array{Float64,1}`: Operand z of size 10.
- `ml8::Array{Float64,1}`: Operand y of size 10.
"""                    
function algorithm1(ml6::Array{Float64,1}, ml7::Array{Float64,1}, ml8::Array{Float64,1})
    # cost: 41 FLOPs
    # x: ml6, full, z: ml7, full, y: ml8, full
    ml9 = Array{Float64}(undef, 1, 1)
    # tmp1 = (x^T z)
    ml9 = BLAS.dot(10, ml6, 1, ml7, 1)

    # x: ml6, full, y: ml8, full, tmp1: ml9, full
    ml10 = Array{Float64}(undef, 1, 1)
    # tmp3 = (x^T y)
    ml10 = BLAS.dot(10, ml6, 1, ml8, 1)

    # tmp1: ml9, full, tmp3: ml10, full
    ml11 = Array{Float64}(undef, 1, 1)
    # tmp8 = (tmp1 tmp3)
    ml11 = ml9 * ml10

    # tmp8: ml11, full
    # alpha = tmp8
    return (ml11)
end